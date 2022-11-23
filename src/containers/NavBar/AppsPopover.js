import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import AppsIcon from '@mui/icons-material/Apps';
import { Button, IconButton } from '@mui/material';
import { appsLinks } from '../../config';
import { ReactComponent as StudioIcon } from '../../assets/apps/studio.svg';
import { ReactComponent as InSyncIcon } from '../../assets/apps/insync.svg';
import { ReactComponent as TvIcon } from '../../assets/apps/tv.svg';

const AppsPopover = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleRedirect = (value) => {
        window.open(value, '_self');
        handleClose();
    };

    const open = Boolean(anchorEl);
    const id = open ? 'apps-popover' : undefined;

    return (
        <div className="apps_div">
            <IconButton aria-describedby={id} onClick={handleClick}>
                <AppsIcon/>
            </IconButton>
            <Popover
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                className="profile_popover apps_popover"
                id={id}
                open={open}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                onClose={handleClose}>
                <Typography className="tab" onClick={() => handleRedirect(appsLinks.STUDIO)}>
                    <Button>
                        <StudioIcon/>
                    </Button>
                </Typography>
                <Typography className="tab" onClick={() => handleRedirect(appsLinks.IN_SYNC)}>
                    <Button>
                        <InSyncIcon/>
                    </Button>
                </Typography>
                <Typography className="tab" onClick={() => handleRedirect(appsLinks.TV)}>
                    <Button>
                        <TvIcon/>
                    </Button>
                </Typography>
            </Popover>
        </div>
    );
};

export default AppsPopover;
