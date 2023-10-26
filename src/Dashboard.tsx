import { Box, FormControl, FormLabel, Grid, Option, Select, Sheet, Typography } from '@mui/joy';
import * as React from 'react';
import { useProgress, usePrs } from './context/StoreContext';
import { PullRequest } from './helpers/graphql';
import humanize_duration from 'humanize-duration';
import CardBlock from './components/Card';
import Loading from './components/Loading';
import PullRequestsTable from './components/PullRequestsTable';
import Avatars from './components/Avatars';
import { median } from './helpers/median';
import Teams from './components/Teams';

export default function Dashboard() {
  const [month, setMonth] = React.useState<number>(-1);
  const [year, setYear] = React.useState<number>(-1);
  const [yearList, setYearList] = React.useState<number[]>([]);
  const prs = usePrs();
  const [prsList, setPrsList] = React.useState<PullRequest[]>(prs);
  const progress = useProgress();

  React.useEffect(() => {
    setYearList([...new Set(prs.map((x) => (new Date(x.mergedAt)).getFullYear()))]);
  }, [prs]);

  React.useEffect(() => {
    setPrsList(prs.filter(x => {
      const mergedAt = new Date(x.mergedAt);
      if (month > -1) {
        if (month !== mergedAt.getMonth()) {
          return false;
        }
      }

      if (year > -1) {
        if (year !== mergedAt.getFullYear()) {
          return false;
        }
      }

      return x;
    }));

  }, [month, year, prs]);

  const code = prsList.reduce((code, pr) => {
    code.additions += pr.additions;
    code.deletions += pr.deletions;
    return code;
  }, { additions: 0, deletions: 0 });

  let no_jira_percentage = 0;
  let no_jira_additions = 0;
  let no_jira_deletions = 0;
  if (prsList.length) {
    no_jira_percentage = prsList.reduce((acc, current) => {
      if (current.JIRA === 'NO-JIRA') {
        no_jira_additions += current.additions;
        no_jira_deletions += current.deletions;
        return acc + 1;
      }
      return acc;
    }, 0) / prsList.length;
  }

  // do we have all information to show it?
  const setup = !!prsList.length;

  return (
    <React.Fragment>
      <Box
        component="main"
        className="MainContent"
        sx={{
          pt: {
            xs: 'calc(12px + var(--Header-height))',
            md: 3,
          },
          pb: {
            xs: 2,
            sm: 2,
            md: 3,
          },

          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          minHeight: '100dvh',
          gap: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            my: 1,
            gap: 1,
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'start', sm: 'center' },
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}
        >
          <Typography level="h2">Dashboard</Typography>
          <Loading />
        </Box>

        <Grid container spacing={2}>
          <Grid xs={2}>
            <FormControl>
              <FormLabel>
                Select month
              </FormLabel>
              <Select disabled={progress > -1} onChange={(_event, newValue) => setMonth(newValue || 0)} value={month}>
                <Option value={-1}>All</Option>
                <Option value={0}>January</Option>
                <Option value={1}>February</Option>
                <Option value={2}>March</Option>
                <Option value={3}>April</Option>
                <Option value={4}>May</Option>
                <Option value={5}>June</Option>
                <Option value={6}>July</Option>
                <Option value={7}>August</Option>
                <Option value={8}>September</Option>
                <Option value={9}>October</Option>
                <Option value={10}>November</Option>
                <Option value={11}>December</Option>
              </Select>
            </FormControl>
          </Grid>
          <Grid xs={2}>
            <FormControl>
              <FormLabel>
                Select year
              </FormLabel>
              <Select disabled={progress > -1} onChange={(_target, newValue) => setYear(newValue || (new Date()).getFullYear())} value={year}>
                <Option value={-1}>All</Option>
                {yearList.map(x => <Option key={x} value={x}>{x}</Option>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid xs={2}>
            <Teams />
          </Grid>
        </Grid>
        {setup && <Sheet sx={{ margin: '5px 0' }}>
          <Grid container>
            <Grid xs={3} sx={{ p: '2px' }}>
              <CardBlock header="# Pull Requests">
                {prsList.length}
              </CardBlock>
            </Grid>
            <Grid xs={3} sx={{ p: '2px' }}>
              <CardBlock header="NO JIRA PRs %">
                <Grid container>
                  <Grid xs={6}>
                    {Math.round(no_jira_percentage * 100)}%
                  </Grid>
                  <Grid xs={6} container>
                    <Grid xs={12}>
                      <Typography sx={{ mt: '5px', display: 'block', height: '10px !important', lineHeight: '10px !important' }} level="body-xs" display='inline' color='success'>+{no_jira_additions} ({Math.round(no_jira_additions / code.additions * 100)}%)</Typography>
                    </Grid>
                    <Grid xs={12}>
                      <Typography sx={{ display: 'block', height: '10px !important', lineHeight: '10px !important' }} level="body-xs" display='inline' color='danger'>-{no_jira_deletions} ({Math.round(no_jira_deletions / code.deletions * 100)}%)</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </CardBlock>
            </Grid>
            <Grid xs={5} sx={{ p: '2px' }}>
              <Avatars prsList={prsList} />
            </Grid>
            <Grid xs={6} sx={{ p: '2px' }}>
              <CardBlock header="Code Churn">
                <Typography display='inline' color='success'>+{code.additions} ({Math.round(code.additions / (code.additions + code.deletions) * 100)}%)</Typography>&nbsp;
                <Typography display='inline' color='danger'>-{code.deletions} ({Math.round(code.deletions / (code.additions + code.deletions) * 100)}%)</Typography>
              </CardBlock>
            </Grid>
            <Grid sx={{ p: '2px' }} md={6} xs={5}>
              <CardBlock header="Time to merge (median)">
                {humanize_duration(median(prsList.map(pr => pr.timeToMergeRaw)), { round: true })}
              </CardBlock>
            </Grid>
            <Grid sx={{ p: '2px' }} md={6} xs={6}>
              <CardBlock header="Time to merge (average)">
                {humanize_duration(prsList.reduce((sum, value) => sum + value.timeToMergeRaw, 0) / prsList.length, { round: true })}
              </CardBlock>
            </Grid>
          </Grid>
        </Sheet>}
        {
          setup && <Sheet sx={{ overflow: 'auto' }}>
            <PullRequestsTable prsList={prsList} setPrsList={setPrsList} />
          </Sheet>
        }
      </Box>
    </React.Fragment>
  );
}

