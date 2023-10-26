import * as React from 'react';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { Box, FormControl, FormLabel, IconButton, Link, Option, Select, Table, Typography } from '@mui/joy';

export default function CustomTable({ list, headers }: { list: any[], headers: { size: string, title: string | React.ReactElement, sort: Function }[] | [] }) {
    const [paginated, setPaginated] = React.useState<any[]>(list.slice(0, 10));
    const [page, setPage] = React.useState<number>(1);
    const [perPage, setPerPage] = React.useState<number>(10);

    let h: React.ReactElement[] = [];
    h = headers.map((header: { size: string, title: string | React.ReactElement, sort: Function }, index: number) => <th key={`header-${index}`} style={{ width: header.size }}><Link onClick={() => header.sort()}>{header.title}</Link></th>)
    if (headers.length) {
    } else {
        h = [<th style={{ width: '100%' }}>No results</th>]
    }

    React.useEffect(() => {
        const start = (page - 1) * perPage;
        const end = page * perPage;
        setPaginated(list.length ? list.slice(start, end) : [])
    }, [page, perPage]);

    React.useEffect(() => {
        const start = (page - 1) * perPage;
        const end = page * perPage;
        setPaginated(list.length ? list.slice(start, end) : [])
        setPage(1);
    }, [list])

    return (<Table borderAxis="both"
        stickyFooter
        stickyHeader
        stripe="even"
        variant="soft">
        <thead><tr key="header">{h}</tr></thead>
        <tbody>
            {paginated.map((item, trIndex) => <tr key={`row-${trIndex}`}>
                {item.map((i: any, tdIndex: number) => <td key={`${trIndex}-${tdIndex}`}>{i}</td>)}
            </tr>)}
        </tbody>
        <tfoot>
            <tr key="footer">
                <td colSpan={headers.length}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            justifyContent: 'center',
                        }}
                    >
                        <FormControl orientation="horizontal" size="sm">
                            <FormLabel>Rows per page:</FormLabel>
                            <Select value={perPage} onChange={(_event: any, newValue: number | null) => setPerPage(parseInt(newValue!.toString(), 10))}>
                                <Option value={5}>5</Option>
                                <Option value={10}>10</Option>
                                <Option value={20}>20</Option>
                            </Select>
                        </FormControl>
                        <Typography textAlign="center" sx={{ minWidth: 80 }}>
                            {(page - 1) * perPage + 1} - {page * perPage} of {list.length}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                                size="sm"
                                color="neutral"
                                variant="outlined"
                                disabled={page === 1 || list.length === 0}
                                onClick={() => setPage(v => v - 1)}
                                sx={{ bgcolor: 'background.surface' }}
                            >
                                <KeyboardArrowLeft />
                            </IconButton>
                            <IconButton
                                size="sm"
                                color="neutral"
                                variant="outlined"
                                disabled={page === Math.ceil(list.length / perPage) || list.length === 0}
                                onClick={() => setPage(v => v + 1)}
                                sx={{ bgcolor: 'background.surface' }}
                            >
                                <KeyboardArrowRight />
                            </IconButton>
                        </Box>
                    </Box>
                </td>
            </tr>
        </tfoot>
    </Table>);
}
