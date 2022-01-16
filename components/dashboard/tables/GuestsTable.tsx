import * as React from 'react';
import { alpha } from '@mui/material/styles';
import { HotelGuest } from '@/interfaces/index';
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

import TableFilter from './TableFilter';
import FilterListIcon from '@mui/icons-material/FilterList';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { visuallyHidden } from '@mui/utils';
import { getComparator, stableSort } from './sort';
import type { Order } from './sort';
interface HeadCell {
  disablePadding: boolean;
  id: keyof HotelGuest;
  label: string;
  numeric: boolean;
  sortable: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'id',
    numeric: false,
    disablePadding: false,
    label: 'ID',
    sortable: false,
  },
  {
    id: 'firstName',
    numeric: false,
    disablePadding: false,
    label: 'Name',
    sortable: true,
  },
  {
    id: 'lastName',
    numeric: false,
    disablePadding: true,
    label: 'Last Name',
    sortable: true,
  },
  {
    id: 'mobileNumber',
    numeric: false,
    disablePadding: false,
    label: 'Mobile',
    sortable: true,
  },
  {
    id: 'landlineNumber',
    numeric: false,
    disablePadding: false,
    label: 'Landline',
    sortable: true,
  },
  {
    id: 'email',
    numeric: false,
    disablePadding: false,
    label: 'Email',
    sortable: true,
  },
  {
    id: 'bookings',
    numeric: false,
    disablePadding: false,
    label: 'Reserve rooms',
    sortable: false,
  },
];

interface EnhancedTableProps {
  numSelected: number | null;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof HotelGuest
  ) => void;
  order: Order;
  orderBy: string;
}
////HEADER
function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof HotelGuest) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox"></TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={'left'}
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
                key={headCell.id}
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
  handleActions: (action:'search' |'pageChange',value:string[]|number )=>void;
}
///// TOGGLE ON CHECK
const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const [isSearching, setIsSearching] = React.useState(false);
  const { numSelected, handleActions } = props;
  const handleSearch = (field: string, value: string) => {
    handleActions('search', [field, value]);
  };
  const toggleSearchMode = () => {
    setIsSearching(!isSearching);
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
          position: 'relative',
        }}
      >
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Guest
        </Typography>

        <Tooltip title="Filter list" onClick={toggleSearchMode}>
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>

        {isSearching && (
          <TableFilter
            closeModal={toggleSearchMode}
            onSearch={handleSearch}
            isModalOpen={isSearching}
            searchFields={[
              { label: 'ID', value: 'id', type: 'number' },
              { label: 'Email', value: 'email', type: 'text' },
              { label: 'Last Name', value: 'lastName', type: 'text' },
              { label: 'First Name', value: 'firstName', type: 'text' },
              { label: 'Mobile', value: 'mobileNumber', type: 'text' },
              { label: 'Landline', value: 'landlineNumber', type: 'text' },
            ]}
          />
        )}
      </Box>
    </Toolbar>
  );
};

export default function EnhancedTable({
  data,
  handleActions,
  totalResults,
  currentPage,
}: {
  data?: Array<HotelGuest>;
  handleActions: (action:'search' |'pageChange',value:string[]|number )=>void;
  totalResults: number;
  currentPage: number;
}) {
  const rows: HotelGuest[] = data || [];
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof HotelGuest>('firstName');
  const [selected, setSelected] = React.useState<number | null>(null);
  const [rowsPerPage] = React.useState(5);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof HotelGuest
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
    handleActions('pageChange', newPage);
  };

  const isSelected = (id: number) => selected === id;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    currentPage > 0
      ? Math.max(0, (1 + currentPage) * rowsPerPage - rows.length)
      : 0;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%' }}>
        <EnhancedTableToolbar
          numSelected={selected}
          handleActions={handleActions}
        />
        <TableContainer sx={{ minHeight: '70vh' }}>
          <Table aria-labelledby="tableTitle" size={'medium'}>
            <EnhancedTableHead
              numSelected={selected}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
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
                  .slice(
                    currentPage * rowsPerPage,
                    currentPage * rowsPerPage + rowsPerPage
                  )
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
                          '&   >*': {
                            borderRight: '1px solid rgba(0,0,0,0.1)',
                          },
                        }}
                      >
                        <TableCell
                          padding="checkbox"
                          sx={{
                            borderRight: 'none',
                          }}
                        >
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            sx={{
                              borderRight: 'none',
                            }}
                            inputProps={{
                              'aria-labelledby': labelId,
                            }}
                          />
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="normal"
                        >
                          {row.id}
                        </TableCell>

                        <TableCell
                          align="left"
                          sx={{
                            minWidth: 'max-content',
                            textTransform: 'capitalize',
                          }}
                        >
                          {row.firstName}
                        </TableCell>
                        <TableCell
                          align="left"
                          sx={{
                            minWidth: 'max-content',
                            textTransform: 'capitalize',
                          }}
                        >
                          {row.lastName}
                        </TableCell>

                        <TableCell
                          align="left"
                          sx={{ minWidth: 'max-content' ,whiteSpace:'pre'}}
                        >
                          {row.mobileNumber}
                        </TableCell>

                        <TableCell
                          align="left"
                          sx={{ minWidth: 'max-content' ,whiteSpace:'pre'}}
                        >
                          {row.landlineNumber}
                        </TableCell>

                        <TableCell
                          align="left"
                          sx={{ minWidth: 'max-content' ,whiteSpace:'pre'}}
                        >
                          {row.email}
                        </TableCell>
                        <TableCell
                          align="left"
                          sx={{ minWidth: 'max-content' }}
                        >
                          {row.bookings.map((booking) => (
                            <Box key={booking.id} sx={{ display: 'gird' }}>
                              <Typography
                                sx={{
                                  minWidth: 'max-content',
                                  fontSize: 'inherit',
                                  fontStyle: 'italic',
                                  fontWeight: 500,
                                  opacity: 0.8,
                                }}
                              >
                                {booking.roomModel.name}
                              </Typography>
                              <Stack
                                direction="row"
                                sx={{ flexWrap: 'wrap', gap: '6px', py: 1 }}
                              >
                                {booking.reservedRooms.map((room) => (
                                  <Chip label={room.number} key={room.number} />
                                ))}
                              </Stack>
                            </Box>
                          ))}
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
          count={totalResults}
          rowsPerPage={6}
          page={currentPage}
          onPageChange={handleChangePage}
        />
      </Paper>
    </Box>
  );
}
