import * as React from 'react';


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
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
 type RoomTypeActions =
    | 'addRoom'
    | 'deleteRooms'
    | 'show/edit'
    | 'edit'
    | 'addBooking';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import BedIcone from '@/components/BedIcone';
import { RoomModel } from '@/interfaces/index';
export function ActionsMenu({
  children,
  handleActions,
  selectedRoomModelId,
  selectedRoomsIds,
}: {
  children: React.ReactNode;
  handleActions: (roomModelId:number,
action:RoomTypeActions,roomsToDelete?:number[])=>void;
  selectedRoomModelId: number;
  selectedRoomsIds: number[];
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMenuClick = (action: RoomTypeActions) => {
    handleActions(selectedRoomModelId, action, selectedRoomsIds);
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
        {Boolean(selectedRoomsIds.length) ? (
          <MenuItem
            onClick={() => handleMenuClick('deleteRooms')}
            sx={{ pr: 3 }}
          >
            <ListItemIcon>
              <DeleteOutlineIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Delete Rooms</ListItemText>
          </MenuItem>
        ) : null}

        <MenuItem onClick={() => handleMenuClick('show/edit')} sx={{ pr: 3 }}>
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

interface Row {
  id: number;
  name: string;
  caption: string;
  lowestPrice: number;
  taxes: number;
  cancelationFee: number;
  maxGuests: number;
  beds: Array<{ id: number; type: string; quantity: number }>;
  rooms: Array<{ id: number; number: number }>;
}
function RoomsTable({
  roomTypes,
  handleActions,
}: {
  roomTypes: RoomModel[];
  handleActions: (roomModelId:number,action:RoomTypeActions,roomsToDelete?:number[])=>void;
}) {
  ////data
  function createData(
    id: number,
    name: string,
    caption: string,
    lowestPrice: number,
    taxes: number,
    cancelationFee: number,
    maxGuests: number,
    beds: Array<{ id: number; type: string; quantity: number }>,
    rooms: Array<{ number: number; id: number }>
  ) {
    return {
      id,
      name,
      caption,
      lowestPrice,
      taxes,
      maxGuests,
      beds,
      rooms,
      cancelationFee,
    };
  }
  const generateRows = (roomTypes: RoomModel[] | []) => {
    const rows = roomTypes?.length
      ? roomTypes.map((roomType) =>
          createData(
            roomType.id,
            roomType.name,
            roomType.mainImage,
            roomType.lowestPrice,
            roomType.taxesAndCharges,
            roomType.cancelationFee,
            roomType.maximunGuests,
            roomType.beds,
            roomType.rooms.map((room: { id: string; number: number }) => ({
              id: parseInt(room.id),
              number: room.number,
            }))
          )
        )
      : [];
    return rows;
  };
  const getRoomModelsToDisplay = (
    rows: Row[],
    page: number,
    rowsPerPage: number
  ) => {
    return rows.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  };
  const Headers = [
    {
      label: 'ID',
      disablePadding: false,
    },
    {
      label: 'Room Type',
      disablePadding: false,
    },
    {
      label: 'Price',
      disablePadding: false,
    },
    {
      label: 'Taxes',
      disablePadding: false,
    },
    {
      label: 'Cancelation Fee',
      disablePadding: false,
    },
    {
      label: 'Capacity',
      disablePadding: false,
    },
    {
      label: 'Rooms',
      disablePadding: false,
    },
  ];
  const [rows, setRows] = React.useState(
    roomTypes?.length ? generateRows(roomTypes) : []
  );
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(3);
  const [displayedRows, setDisplayedRows] = React.useState(
    rows ? getRoomModelsToDisplay(rows, page, rowsPerPage) : []
  );
  React.useEffect(() => {
    const actualizedRows = generateRows(roomTypes);
    setRows(actualizedRows);
    setDisplayedRows(getRoomModelsToDisplay(actualizedRows, page, rowsPerPage));
  }, [roomTypes]);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
    setDisplayedRows(getRoomModelsToDisplay(rows, page, rowsPerPage));
    getRoomModelsToDisplay;
  };
  const [selectedRooms, setSelectedRooms] = React.useState<number[]>([]);
  const handleSelectedRooms = (roomId: number) => {
    if (selectedRooms.length && selectedRooms.includes(roomId)) {
      return setSelectedRooms(selectedRooms.filter((id) => id !== roomId));
    }
    return setSelectedRooms([...selectedRooms, roomId]);
  };

  return (
    <TableContainer
      component={Paper}
      elevation={4}
      sx={{ width: '100%', mb: 0 }}
    >
      <Table aria-label="simple table" size="medium" sx={{ minHeight: '50vh' }}>
        <TableHead sx={{ py: 2, width: '100%' }}>
          <TableRow>
            <TableCell align="right"></TableCell>
            {Headers.map((header) => (
              <TableCell key={header.label}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    minWidth: 'max-content',
                    pr: 1,
                  }}
                >
                  {header.label}
                </Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {!Boolean(displayedRows.length) ? (
            <TableRow sx={{ maxHeight: 'max-content' }}>
              <TableCell component="th" scope="row" colSpan={7}>
                <Box
                  sx={{
                    minHeight: '40vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      textTransform: 'capitalize',
                      textAlign: 'center',
                    }}
                  >
                    No data to display
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            displayedRows.map((row) => (
              <TableRow
                key={row.name}
                sx={{
                  '& td': { borderRight: '1px solid rgba(224, 224, 224, 1)' },

                  '& th': { borderRight: '1px solid rgba(224, 224, 224, 1)' },
                }}
              >
                <TableCell component="th" scope="row">
                  {/* ACTION MENU */}
                  <ActionsMenu
                    handleActions={handleActions}
                    selectedRoomModelId={row.id}
                    selectedRoomsIds={selectedRooms}
                  >
                    <ActionsButton />
                  </ActionsMenu>
                </TableCell>
                <TableCell align="center" sx={{ borderRight: 'none' }}>
                  <Typography>{row.id}</Typography>
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Card
                      sx={{
                        maxWidth: '150px',
                        minWidth: '150px',
                        height: '100px',
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={row.caption}
                        alt={row.name}
                      />
                    </Card>
                    <Typography
                      sx={{
                        fontSize: '14px',
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
                  <Typography
                    sx={{ fontSize: '14px', minWidth: 'max-content' }}
                  >
                    USD ${row.lowestPrice}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography
                    sx={{ fontSize: '14px', minWidth: 'max-content' }}
                  >
                    USD ${row.taxes}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography
                    sx={{ fontSize: '14px', minWidth: 'max-content' }}
                  >
                    USD ${row.cancelationFee}
                  </Typography>
                </TableCell>

                <TableCell align="right">
                  <Box
                    component="ul"
                    sx={{
                      minWidth: 'max-content',
                      display: 'flex',
                      flexDirection: 'column',
                      px: 1,
                    }}
                  >
                    <Box sx={{ display: 'flex' }} component="li">
                      <PersonOutlineIcon fontSize="small" color="secondary" />
                      <Typography
                        sx={{ minWidth: 'max-content', fontSize: '14px' }}
                      >
                        {`${row.maxGuests} ${
                          row.maxGuests === 1 ? 'guest' : 'guests'
                        } max.`}
                      </Typography>
                    </Box>
                    {row.beds.map((bed) => (
                      <Box
                        key={bed.type}
                        sx={{ display: 'flex' }}
                        component="li"
                      >
                        <BedIcone type={bed.type} size="small" />
                        <Typography
                          sx={{ minWidth: 'max-content', fontSize: '14px' }}
                        >
                          {`${bed.quantity} ${bed.type} ${
                            bed.quantity === 1 ? 'bed' : 'beds'
                          }`}
                        </Typography>
                      </Box>
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
                      {row.rooms.map((room) => (
                        <Chip
                          key={room.number}
                          label={room.number}
                          color={
                            selectedRooms.includes(room.id)
                              ? 'primary'
                              : 'default'
                          }
                          onClick={() => handleSelectedRooms(room.id)}
                        />
                      ))}
                    </Stack>
                  </Box>
                </TableCell>
              </TableRow>
            ))
          )}
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
