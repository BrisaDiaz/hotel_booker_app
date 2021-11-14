import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <div className="container">{children}</div>
        </Box>
      )}
    </div>
  );
}
interface TabData {
  title: string;
  Content: React.ReactNode;
}
type props = {
  data: TabData[];
};
export default function BasicTabs({ data }: props) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          color: 'primary',
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          {data.map((tab) => (
            <Tab key={tab.title} label={tab.title} />
          ))}
        </Tabs>
      </Box>
      {data.map((tab, index) => (
        <TabPanel key={tab.title} value={value} index={index}>
          {tab.Content}
        </TabPanel>
      ))}
    </Box>
  );
}
