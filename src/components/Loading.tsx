import { LinearProgress, Sheet, Typography } from '@mui/joy';
import { useProgress, useTeamName } from '../context/StoreContext';

export default function Loading() {
    const progress = useProgress();
    const teamName = useTeamName();

    if (progress === -1) {
        return <Typography
            level="title-lg"
            variant="plain">
            {teamName}
        </Typography>;
    }

    return (
        <Sheet>
            <LinearProgress
                determinate
                variant="outlined"
                color="neutral"
                size="sm"
                thickness={24}
                value={Number(progress)}
                sx={{
                    '--LinearProgress-radius': '20px',
                    '--LinearProgress-thickness': '24px',
                    width: '200px'
                }}>
                <Typography
                    level="body-xs"
                    fontWeight="xl"
                    textColor="common.white"
                    sx={{ mixBlendMode: 'difference' }}
                >
                    LOADING… {`${progress}%`}
                </Typography>
            </LinearProgress>
        </Sheet>
    );
}
