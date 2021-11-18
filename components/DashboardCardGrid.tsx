import Grid from '@mui/material/Grid';

import DashboardCard from './DashboardCard';
type Card = {
  title: string;
  actions: Action[];
  count: number;
  color?: string;
};
export default function DashboardCardGrid({ cards }: { cards: Card[] }) {
  return (
    <Grid
      container
      sx={{
        width: '100%',
        maxWidth: '1000px',
        justifyContent: { xs: 'center', md: 'start' },
        p: 3,
      }}
      spacing={3}
    >
      {cards.map((card) => (
        <Grid
          item
          xs={12}
          md={4}
          lg={3.5}
          key={card.title}
          sx={{
            display: 'flex',
            justifyContent: { sx: 'center', md: 'start' },
          }}
        >
          <DashboardCard card={card} />
        </Grid>
      ))}
    </Grid>
  );
}
