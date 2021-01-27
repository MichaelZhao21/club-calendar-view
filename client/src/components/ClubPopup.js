import React from 'react';
import { connect } from 'react-redux';
import ExecCard from './ExecCard';
import CommitteeCard from './CommitteeCard';
import { getPopupEdit, getPopupId, getPopupNew, getPopupOpen } from '../redux/selectors';
import {
    setPopupOpen,
    setPopupId,
    setPopupEdit,
    updateClub,
    setPopupNew,
    addClub,
    deleteSavedClub,
    setPopupDeleted,
} from '../redux/actions';
import './ClubPopup.scss';
import { deleteClub, getClub, postClub } from '../functions/api';
import ActionButton from './ActionButton';
import { compressUploadedImage, imgUrl, isActive } from '../functions/util';
import ImageUpload from './ImageUpload';
import ExecEdit from './ExecEdit';
import CommitteeEdit from './CommitteeEdit';
import { Club, ClubInfo, Committee, Exec } from '../functions/entries';
import { ReactComponent as TrashIcon } from '../files/trash-can.svg';

class ClubPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            execTab: true,
            club: null,
            name: '',
            advised: false,
            fb: '',
            website: '',
            coverImg: '',
            description: '',
            execs: null,
            committees: null,
            compressed: null,
            execBlobs: null,
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleImageUpload = this.handleImageUpload.bind(this);
        this.handleProfPicUpload = this.handleProfPicUpload.bind(this);
        this.handleExecChange = this.handleExecChange.bind(this);
        this.handleCommitteeChange = this.handleCommitteeChange.bind(this);
    }

    getClubData = async () => {
        const club = await getClub(this.props.id);
        if (club !== null) this.resetState(club);
    };

    switchTab = (tab) => this.setState({ execTab: tab === 'execs' });

    openEdit = () => {
        this.props.setPopupEdit(true);
    };

    closeEdit = () => {
        this.props.setPopupEdit(false);
        if (this.props.new) this.props.setPopupOpen(false);
        this.resetState();
    };

    resetState = (club = null) => {
        if (club === null) club = this.state.club;
        this.setState({
            club,
            name: club.name,
            advised: club.advised,
            fb: club.fb,
            website: club.website,
            coverImg: club.coverImg,
            description: club.description,
            execs: [...club.execs],
            committees: [...club.committees],
            editedBy: '',
            execBlobs: Array(club.execs.length),
            compressed: null,
        });
    };

    submit = async () => {
        var invalid = this.testValid();

        // If there are invalid items
        if (invalid.length !== 0) {
            var invalidMessage = '';
            invalid.forEach((i) => (invalidMessage += `${i} cannot be empty!\n`));
            alert(invalidMessage);
            return;
        }

        var coverThumb = null;
        if (this.state.compressed) coverThumb = await compressUploadedImage(this.state.compressed, 432);

        var fullClub = new Club(
            this.state.name,
            this.state.advised,
            this.state.fb,
            this.state.website,
            this.state.club.coverImg,
            this.state.club.coverImgThumbnail,
            this.state.description,
            this.state.execs,
            this.state.committees,
            { img: this.state.compressed, thumb: coverThumb },
            this.state.execBlobs
        );

        // POST Club
        var res;
        if (this.props.id === 'new') {
            res = await postClub(fullClub);
            fullClub.objId = res.id;
        } else {
            fullClub.oldExecs = this.state.club.execs;
            fullClub.oldCommittees = this.state.club.committees;
            res = await postClub(fullClub, this.state.club.objId);
        }

        if (res.status === 200) {
            var objId = this.state.club.objId;
            if (this.props.new) objId = res.id;
            var clubObj = new ClubInfo(
                objId,
                this.state.name,
                this.state.advised,
                this.state.fb,
                this.state.website,
                this.state.coverImg
            );

            var newClub = await getClub(this.props.id);

            if (this.props.new) this.props.addClub(clubObj);
            else this.props.updateClub(this.state.club.objId, clubObj);

            this.props.setPopupEdit(false);

            if (this.props.new) this.props.setPopupOpen(false);
            else this.resetState(newClub);

            alert('Successfully added!');
        } else alert('Adding club failed :(');
    };

    testValid = () => {
        var invalid = [];
        if (this.state.name === '') invalid.push('Club Name');
        for (var i = 0; i < this.state.execs.length; i++) {
            if (this.state.execs[i].name === '') invalid.push(`Exec ${i + 1}'s Name`);
            if (this.state.execs[i].position === '') invalid.push(`Exec ${i + 1}'s Position`);
        }
        for (var i = 0; i < this.state.committees.length; i++) {
            if (this.state.committees[i].name === '') invalid.push(`Committee ${i + 1}'s Name`);
        }
        return invalid;
    };

    changeAdvised = () => {
        this.setState({ advised: !this.state.advised });
    };

    handleInputChange = (event) => {
        const target = event.target;
        this.setState({ [target.name]: target.value });
    };

    handleImageUpload = async (event) => {
        const compressed = await compressUploadedImage(event.target.files[0], 1728);
        const url = URL.createObjectURL(compressed);
        this.setState({ compressed, coverImg: url });
    };

    handleProfPicUpload = async (event) => {
        const compressed = await compressUploadedImage(event.target.files[0], 256);
        const url = URL.createObjectURL(compressed);
        const count = Number(event.target.name.substring(21));
        var execs = this.state.execs;
        var execBlobs = this.state.execBlobs;
        execs[count] = { ...this.state.execs[count], img: url };
        execBlobs[count] = compressed;
        this.setState({ execs, execBlobs });
    };

    handleExecChange = (event) => {
        const target = event.target;
        const count = Number(target.attributes.num.nodeValue);
        var execs = this.state.execs;
        execs[count] = { ...this.state.execs[count], [target.name]: target.value };
        this.setState({ execs });
    };

    handleCommitteeChange = (event) => {
        const target = event.target;
        const count = Number(target.attributes.num.nodeValue);
        var committees = this.state.committees;
        committees[count] = { ...this.state.committees[count], [target.name]: target.value };
        this.setState({ committees });
    };

    handleExecDelete = (num) => {
        var execs = this.state.execs;
        var execBlobs = this.state.execBlobs;
        if (confirm(`Are you sure you want to delete Exec #${num + 1}?`)) {
            execs.splice(num, 1);
            execBlobs.splice(num, 1);
            this.setState({ execs, execBlobs });
        }
    };

    addExec = () => {
        var execs = this.state.execs;
        var execBlobs = this.state.execBlobs;
        // TODO: Add default constructor for exec & committee (prob convert to classes in entries.js)
        execs.push(new Exec());
        execBlobs.push(null);
        this.setState({ execs, execBlobs });
    };

    handleCommitteeDelete = (num) => {
        var committees = this.state.committees;
        if (confirm(`Are you sure you want to delete Committee #${num + 1}?`)) {
            committees.splice(num, 1);
            this.setState({ committees });
        }
    };

    addCommittee = () => {
        var committees = this.state.committees;
        committees.push(new Committee());
        this.setState({ committees });
    };

    deleteClub = async () => {
        const confirmDelete = prompt(
            `Are you SURE you want to delete this club? Please type the name of the club (${this.state.club.name}) below to confirm:`
        );
        const currObjId = this.state.club.objId;
        if (
            confirmDelete !== null &&
            confirmDelete.toLowerCase().trim() === this.state.club.name.toLowerCase().trim()
        ) {
            const status = await deleteClub(currObjId);
            if (status === 200) {
                alert('Club successfully deleted!');
                this.props.setPopupDeleted(true);
            } else {
                alert('ERROR: Club could not be deleted');
            }
        }
    };

    componentDidUpdate(prevProps) {
        if (prevProps.popupOpen === this.props.popupOpen) return;
        if (this.props.popupOpen && this.props.id !== null) {
            if (this.props.new) {
                this.resetState(new Club());
            } else {
                this.getClubData();
            }
        } else {
            this.setState({ club: null });
        }
    }

    render() {
        if (!this.props.popupOpen || this.state.club === null) return <div className="club-popup"></div>;

        var execList = [];
        this.state.club.execs.forEach((exec) => {
            execList.push(<ExecCard exec={exec} key={exec.name}></ExecCard>);
        });

        var committeeList = [];
        this.state.club.committees.forEach((committee) => {
            committeeList.push(<CommitteeCard committee={committee} key={committee.name}></CommitteeCard>);
        });

        var execEditList = [];
        for (var i = 0; i < this.state.execs.length; i++) {
            execEditList.push(
                <ExecEdit
                    num={i}
                    key={i}
                    exec={this.state.execs[i]}
                    onImgChange={this.handleProfPicUpload}
                    onChange={this.handleExecChange}
                    onDelete={this.handleExecDelete.bind(this, i)}
                ></ExecEdit>
            );
        }

        var committeeEditList = [];
        for (var i = 0; i < this.state.committees.length; i++) {
            committeeEditList.push(
                <CommitteeEdit
                    num={i}
                    key={i}
                    committee={this.state.committees[i]}
                    onChange={this.handleCommitteeChange}
                    onDelete={this.handleCommitteeDelete.bind(this, i)}
                ></CommitteeEdit>
            );
        }

        return (
            <div className="club-popup">
                <div className={isActive('club-popup-view', !this.props.edit)}>
                    <img className="club-popup-image" src={imgUrl(this.state.coverImg)} alt="cover image"></img>
                    <p className={isActive('club-popup-advised', this.state.club.advised)}>
                        {this.state.club.advised ? 'Advised' : 'Independent'}
                    </p>
                    <p className="club-popup-name">{this.state.club.name}</p>
                    <p className="club-popup-description">{this.state.club.description}</p>
                    <div className="club-popup-links">
                        <p className="club-popup-link fb" onClick={() => window.open(this.state.club.website)}>
                            {this.state.club.website}
                        </p>
                        <p className="club-popup-link website" onClick={() => window.open(this.state.club.fb)}>
                            {this.state.club.fb}
                        </p>
                    </div>
                    <div className="club-popup-tab-container">
                        <div
                            className={isActive('club-popup-tab-item', this.state.execTab)}
                            onClick={() => this.switchTab('execs')}
                        >
                            Execs
                        </div>
                        <div
                            className={isActive('club-popup-tab-item', !this.state.execTab)}
                            onClick={() => this.switchTab('committees')}
                        >
                            Committees
                        </div>
                    </div>
                    {this.state.execTab ? (
                        <div className="club-popup-execs">{execList}</div>
                    ) : (
                        <div className="club-popup-committees">{committeeList}</div>
                    )}
                    <ActionButton className="club-popup-edit-button" onClick={this.openEdit}>
                        Edit
                    </ActionButton>
                </div>
                <div className={isActive('club-popup-edit', this.props.edit)}>
                    <div className="club-popup-edit-image-container">
                        <img className="club-popup-image" src={imgUrl(this.state.coverImg)} alt="cover image"></img>
                        <ImageUpload
                            name="coverImage"
                            className="club-popup-cover-photo-upload"
                            onChange={this.handleImageUpload}
                        ></ImageUpload>
                    </div>
                    <div className="club-popup-edit-bottom">
                        <div className="club-popup-name-advised-div">
                            <input
                                name="name"
                                className="line-in club-popup-name-input"
                                type="text"
                                placeholder="Club name..."
                                value={this.state.name}
                                onChange={this.handleInputChange}
                            ></input>
                            <ActionButton
                                className={isActive('club-popup-advised club-popup-advised-edit', this.state.advised)}
                                onClick={this.changeAdvised}
                            >
                                {this.state.advised ? 'Advised' : 'Independent'}
                            </ActionButton>
                        </div>
                        <label htmlFor="description">Description</label>
                        <br />
                        <textarea
                            name="description"
                            className="club-popup-description-input"
                            type="text"
                            placeholder="Enter a description for your club"
                            value={this.state.description}
                            onChange={this.handleInputChange}
                        ></textarea>
                        <label htmlFor="fb" className="club-popup-link-label">
                            Facebook
                        </label>
                        <input
                            name="fb"
                            className="line-in club-popup-link-input"
                            type="text"
                            placeholder="Facebook link"
                            value={this.state.fb}
                            onChange={this.handleInputChange}
                        ></input>
                        <br />
                        <label htmlFor="website" className="club-popup-link-label">
                            Website
                        </label>
                        <input
                            name="website"
                            className="line-in club-popup-link-input"
                            type="text"
                            placeholder="Facebook link"
                            value={this.state.website}
                            onChange={this.handleInputChange}
                        ></input>
                        <p className="club-popup-card-edit-heading">Execs</p>
                        <div className="club-popup-card-edit-list">{execEditList}</div>
                        <div className="club-popup-add-container">
                            <ActionButton className="club-popup-add" onClick={this.addExec}>
                                Add Exec
                            </ActionButton>
                        </div>
                        <p className="club-popup-card-edit-heading">Committees</p>
                        <div className="club-popup-card-edit-list">{committeeEditList}</div>
                        <div className="club-popup-add-container">
                            <ActionButton className="club-popup-add" onClick={this.addCommittee}>
                                Add Committee
                            </ActionButton>
                        </div>
                        <div className="action-button-box club-popup-action-button-box">
                            <div className={isActive('club-popup-trash-group', !this.props.new)}>
                                <div className="club-popup-delete-box" onClick={this.deleteClub}>
                                    <TrashIcon className="trash-icon club-popup-trash-icon"></TrashIcon>
                                    <p className="club-popup-delete-text">Delete this Club</p>
                                </div>
                            </div>
                            <ActionButton className="cancel club-popup-action-button" onClick={this.closeEdit}>
                                Cancel
                            </ActionButton>
                            <ActionButton className="submit club-popup-action-button" onClick={this.submit}>
                                Submit
                            </ActionButton>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        popupOpen: getPopupOpen(state),
        id: getPopupId(state),
        edit: getPopupEdit(state),
        new: getPopupNew(state),
    };
};
const mapDispatchToProps = {
    setPopupOpen,
    setPopupId,
    setPopupEdit,
    updateClub,
    setPopupNew,
    addClub,
    deleteSavedClub,
    setPopupDeleted,
};

export default connect(mapStateToProps, mapDispatchToProps)(ClubPopup);
