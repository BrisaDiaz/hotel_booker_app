import * as React from 'react';
import { toDateAndHourFormat } from '@/utils/index';
import { alpha } from '@mui/material/styles';
import { BookingRequest } from '@/interfaces/index';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ClearIcon from '@mui/icons-material/Clear';

import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';

interface Data {
  id: number;
  checkInDate: string;
  checkOutDate: string;
  sentIn: string;
  nights: number;
  roomsQuantity: number;
  roomType: {
    id: number;
    name: string;
  };
  client: {
    id: number;
    name: string;
  };
}

function createData({
  id,
  createdAt,
  checkInDate,
  checkOutDate,
  nights,
  client,
  guestsDistribution,
  roomModel,
}: BookingRequest): Data {
  return {
    id,
    checkInDate: toDateAndHourFormat(parseInt(checkInDate)).split(' ')[0],
    checkOutDate: toDateAndHourFormat(parseInt(checkOutDate)).split(' ')[0],
    roomsQuantity: guestsDistribution.length,
    sentIn: toDateAndHourFormat(parseInt(createdAt)),
    roomType: roomModel,
    nights,
    client: {
      id: client.id,
      name: `${client.firstName} ${client.lastName}`,
    },
  };
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
  sortable: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'id',
    numeric: false,
    disablePadding: true,
    label: 'id',
    sortable: false,
  },
  {
    id: 'sentIn',
    numeric: false,
    disablePadding: false,
    label: 'Sent In',
    sortable: true,
  },
  {
    id: 'roomType',
    numeric: false,
    disablePadding: false,
    label: 'Room Type',
    sortable: false,
  },
  {
    id: 'roomsQuantity',
    numeric: true,
    disablePadding: false,
    label: 'Quantity',
    sortable: true,
  },
  {
    id: 'nights',
    numeric: true,
    disablePadding: false,
    label: 'Nights',
    sortable: true,
  },
  {
    id: 'checkInDate',
    numeric: false,
    disablePadding: false,
    label: 'Check In',
    sortable: true,
  },
  {
    id: 'checkOutDate',
    numeric: false,
    disablePadding: false,
    label: 'Check Out',
    sortable: true,
  },
  {
    id: 'client',
    numeric: false,
    disablePadding: false,
    label: 'Client',
    sortable: false,
  },
];

interface EnhancedTableProps {
  numSelected: number | null;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  order: Order;
  orderBy: string;
}
////HEADER
function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox"></TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={'center'}
            sx={{ minWidth: 'max-content' }}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.sortable ? (
              <TableSortLabel
                sx={{ minWidth: 'max-content' }}
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc'
                      ? 'sorted descending'
                      : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, minWidth: 'max-content' }}
              >
                {headCell.label}
              </Typography>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number | null;
  handleAcctions: Function;

  resetSelection: Function;
}
///// TOGGLE ON CHECK
const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const { numSelected, handleAcctions, resetSelection } = props;
  const handleActionClick = (actionName: string) => {
    handleAcctions(actionName, numSelected);
  };
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      <Box
        sx={{
          maxWidth: '93vw',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        {numSelected ? (
          <Typography
            sx={{ flex: '1 1 100%' }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            Request selected: {numSelected}
          </Typography>
        ) : (
          <Typography
            sx={{ flex: '1 1 100%' }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Room Requests
          </Typography>
        )}
        {numSelected ? (
          <Box sx={{ display: 'flex' }}>
            <Tooltip
              title="show/confirm"
              onClick={() => handleActionClick('show/confirm')}
            >
              <IconButton>
                <VisibilityOutlinedIcon color="primary" fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip
              title="decline and remove from the queue"
              onClick={() => handleActionClick('decline')}
            >
              <IconButton>
                <ClearIcon color="primary" fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        ) : (
          <Tooltip title="Filter list">
            <IconButton>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Toolbar>
  );
};

export default function EnhancedTable({
  data,

  handleAcctions,
}: {
  data: Array<BookingRequest>;
  handleAcctions: Function;
}) {
  const rows = data?.length ? data.map((record) => createData(record)) : [];
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('sentIn');
  const [selected, setSelected] = React.useState<number | string | null>(null);
  const [page, setPage] = React.useState(0);

  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    if (selected === id) {
      return setSelected(null);
    }
    setSelected(id);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id: number) => selected === id;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected}
          handleAcctions={handleAcctions}
          resetSelection={() => setSelected(null)}
        />
        <TableContainer>
          <Table
            aria-labelledby="tableTitle"
            size={'medium'}
            sx={{ minWidth: '70vh' }}
          >
            <EnhancedTableHead
              numSelected={selected}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody sx={{ minWidth: '70vh' }}>
              {!Boolean(rows.length) ? (
                <TableRow>
                  <TableCell
                    component="th"
                    scope="row"
                    colSpan={headCells.length + 1}
                  >
                    <Box
                      sx={{
                        minHeight: '50vh',
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
                stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                        sx={{
                          '&  td >*': {
                            fontSize: '14px',
                          },
                        }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              'aria-labelledby': labelId,
                            }}
                          />
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          {row.id}
                        </TableCell>

                        <TableCell align="center" sx={{ minWidth: 120 }}>
                          {row.sentIn}
                        </TableCell>
                        <TableCell
                          align="left"
                          sx={{ minWidth: 200, textTransform: 'capitalize' }}
                        >
                          {row.roomType.name}
                        </TableCell>

                        <TableCell align="center">
                          {row.roomsQuantity}
                        </TableCell>

                        <TableCell align="center">{row.nights}</TableCell>

                        <TableCell align="center" sx={{ minWidth: 120 }}>
                          {row.checkInDate}
                        </TableCell>
                        <TableCell align="center" sx={{ minWidth: 130 }}>
                          {row.checkOutDate}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ minWidth: 150, textTransform: 'capitalize' }}
                        >
                          {row.client.name}
                        </TableCell>
                      </TableRow>
                    );
                  })
              )}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
