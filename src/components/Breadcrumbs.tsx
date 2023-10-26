import BreadcrumbsJoy from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import Typography from '@mui/joy/Typography';
import { useLocation } from 'react-router-dom';

export default function Breadcrumbs() {

    const location = useLocation()
    const page = location.pathname.substring(1)

    return <BreadcrumbsJoy
        size="sm"
        aria-label="breadcrumbs"
        separator={<ChevronRightRoundedIcon />}
        sx={{ pl: 0 }}
    >
        <Link
            underline="none"
            color="neutral"
            href="/#"
            aria-label="Home"
        >
            <HomeRoundedIcon />
        </Link>
        {page !== '' && page.split('/').map(x => {
            if (page.search(x) + x.length === page.length) {
                return <Typography key={page.substring(0, page.search(x)) + x} color="primary" fontWeight={500} fontSize={12}>
                    {x}
                </Typography>;
            }
            return <Link
                key={page.substring(0, page.search(x)) + x}
                underline="hover"
                color="neutral"
                href={"/#" + page.substring(0, page.search(x)) + x}
                fontSize={12}
                fontWeight={500}
            >
                {x}
            </Link>
        })}
    </BreadcrumbsJoy>;
}
