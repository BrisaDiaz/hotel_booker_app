import * as React from 'react';

import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import TablePaginationActions from './TablePaginationActions';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/ModeEditOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';
import BedroomParentOutlinedIcon from '@mui/icons-material/BedroomParentOutlined';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    headerLabel: {
      fontWeight: 600,
      paddingRight: theme.spacing(1),
      width: 'max-content',
      opacity: 0.8,
    },
    bodyCell: {
      borderRight: '1px solid rgba(0,0,0,0.1)',
    },
  })
);
export function ActionsMenu({
  children,
  handleActions,
  roomModelId,
}: {
  children: React.ReactNode;
  handleActions: Function;
  roomModelId: number;
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMenuClick = (action: string) => {
    handleActions(roomModelId, action);

    handleClose();
  };
  return (
    <div>
      <div onClick={handleClick}>{children}</div>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => handleMenuClick('displayRoomsStatus')}
          sx={{ pr: 3 }}
        >
          <ListItemIcon>
            <BedroomParentOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Rooms Status</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleMenuClick('addRoom')} sx={{ pr: 3 }}>
          <ListItemIcon>
            <AddCircleOutlineIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Add Room</ListItemText>
        </MenuItem>
        <MenuItem sx={{ pr: 3 }} onClick={() => handleMenuClick('addBooking')}>
          <ListItemIcon>
            <AddCircleOutlineIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Add Booking</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleMenuClick('edit')} sx={{ pr: 3 }}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
}
const ActionsButton = () => {
  return (
    <Tooltip disableFocusListener title="Actions">
      <IconButton aria-label="menu" size="small">
        <MoreVertIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};
interface RoomType {
  __typename: string;
  id: number;
  name: string;
  mainImage: string;
  lowestPrice: number;
  taxesAndCharges: number;
  mts2: number;
  maximunGuests: number;
  beds: Array<{ id: number; type: string; quantity: number }>;
  rooms: Array<{ id: number; number: number }>;
}
function RoomsTable({
  roomTypes,
  handleActions,
}: {
  roomTypes: RoomType[];
  handleActions: Function;
}) {
  const classes = useStyles();
  ////data
  function createData(
    id: number,
    name: string,
    caption: string,
    lowestPrice: number,
    taxes: number,
    maxGuests: number,
    beds: Array<{ id: number; type: string; quantity: number }>,
    rooms: number[]
  ) {
    return { id, name, caption, lowestPrice, taxes, maxGuests, beds, rooms };
  }
  const rows = roomTypes.map((roomType) =>
    createData(
      roomType.id,
      roomType.name,
      roomType.mainImage,
      roomType.lowestPrice,
      roomType.taxesAndCharges,
      roomType.maximunGuests,
      roomType.beds,
      roomType.rooms.map((room: { id: number; number: number }) => room.number)
    )
  );
  //// pagination logic

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(3);
  const [displayedRows, setDisplayedRows] = React.useState(
    rows.slice(page * rowsPerPage, (page + 1) * rowsPerPage)
  );
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
    setDisplayedRows(
      rows.slice(newPage * rowsPerPage, (newPage + 1) * rowsPerPage)
    );
  };

  return (
    <TableContainer component={Paper} elevation={4} sx={{ borderRadius: 4 }}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table" size="medium">
        <TableHead sx={{ py: 2 }}>
          <TableRow>
            <TableCell align="right"></TableCell>
            <TableCell>
              <Typography className={classes.headerLabel}>Room Type</Typography>
            </TableCell>

            <TableCell align="right">
              <Typography className={classes.headerLabel}>Price</Typography>
            </TableCell>
            <TableCell align="right">
              <Typography className={classes.headerLabel}>Taxes</Typography>
            </TableCell>

            <TableCell align="right">
              <Typography className={classes.headerLabel}>Capacity</Typography>
            </TableCell>
            <TableCell align="right">
              <Typography className={classes.headerLabel}>Rooms</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayedRows.map((row) => (
            <TableRow
              key={row.name}
              sx={{
                '& td': { borderRight: '1px solid rgba(224, 224, 224, 1)' },

                '& th': { borderRight: '1px solid rgba(224, 224, 224, 1)' },
              }}
            >
              <TableCell component="th" scope="row">
                {/* ACTION MENU */}
                <ActionsMenu handleActions={handleActions} roomModelId={row.id}>
                  <ActionsButton />
                </ActionsMenu>
              </TableCell>
              <TableCell align="right">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Card sx={{ width: '200px', position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="150px"
                      image={row.caption}
                      alt={row.name}
                    />
                  </Card>
                  <Typography
                    sx={{
                      minWidth: 150,
                      textAlign: 'start',
                      padding: '0 16px',
                      fontStyle: 'italic',
                      fontWeight: 500,
                      opacity: 0.8,
                    }}
                  >
                    {row.name}
                  </Typography>
                </Box>
              </TableCell>

              <TableCell align="right">
                {' '}
                <Typography sx={{ minWidth: 'max-content' }}>
                  USD ${row.lowestPrice}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography sx={{ minWidth: 'max-content' }}>
                  USD ${row.taxes}
                </Typography>
              </TableCell>

              <TableCell align="right">
                <Box
                  sx={{
                    minWidth: 'max-content',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Typography sx={{ minWidth: 'max-content' }}>
                    {`${row.maxGuests} ${
                      row.maxGuests === 1 ? 'guest' : 'guests'
                    } max.`}
                  </Typography>
                  {row.beds.map((bed) => (
                    <Typography sx={{ minWidth: 'max-content' }} key={bed.type}>
                      {`${bed.quantity} ${bed.type} ${
                        bed.quantity === 1 ? 'bed' : 'beds'
                      }`}
                    </Typography>
                  ))}
                </Box>
              </TableCell>
              <TableCell align="right">
                <Box sx={{ width: 200 }}>
                  <Stack
                    direction="row"
                    sx={{
                      flexWrap: 'wrap',
                      gap: 1,
                    }}
                  >
                    {row.rooms.map((number) => (
                      <Chip key={number} label={number} />
                    ))}
                  </Stack>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[]}
              colSpan={3}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  'aria-label': 'rows per page',
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
export default RoomsTable;
