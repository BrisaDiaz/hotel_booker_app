import Grid from '@mui/material/Grid';

import DashboardCard from './DashboardCard';

export default function DashboardCardGrid({ cards }: { cards: Card[] }) {
  return (
    <Grid
      container
      sx={{
        width: '100%',
        maxWidth: '1050px',
        mx: 'auto',

        justifyContent: { xs: 'center', lg: 'start' },
      }}
      columns={{ xs: 12, sm: 14, lg: 12 }}
    >
      {cards.map((card) => (
        <Grid
          item
          xs={12}
          lg={3}
          md={6}
          sx={{ p: 2, width: '240px', gap: 1.5 }}
          key={card.title}
        >
          <DashboardCard card={card} />
        </Grid>
      ))}
    </Grid>
  );
}
