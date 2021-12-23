import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import InputAdornment from '@mui/material/InputAdornment';
import KingBedIcon from '@mui/icons-material/KingBed';
import { styles } from './styles';

export default function BookingClientInputs({
  register,
  errors,
  availableRooms,
  requiredRooms,
  setValue,

  disable,
}: {
  register: Function;
  setValue: Function;

  errors: any;
  disable?: Boolean;
  requiredRooms?: number;
  availableRooms: Array<{ id: number; number: number }> | [];
}) {
  const paymentMethods = [
    { name: 'Cash', value: 'CASH' },
    { name: 'Debit Card', value: 'DEBIT_CARD' },
    { name: 'Credit Card', value: 'CREDIT_CARD' },
    { name: 'Bill To Account', value: 'BILL_TO_ACCOUNT' },
    { name: 'Traveler Check', value: 'TRAVELER_CHECK' },
  ];

  const [paymentMethodSelected, setPaymentMethodSelected] =
    React.useState<string>(paymentMethods[0].value);
  const handlePaymentMethodField = (event: SelectChangeEvent) => {
    setPaymentMethodSelected(event.target.value as string);
  };
  const [numbersSelected, setNumbersSelected] = React.useState<number[]>([]);

  const handleDeleteNumber = (toDeleteNumber: number) => {
    setNumbersSelected(
      numbersSelected.filter((number) => number !== toDeleteNumber)
    );
  };
  const handleAddMoreRooms = (roomNumber: number) => {
    const numberOfRoomsRequired = requiredRooms;

    if (numbersSelected.includes(roomNumber)) {
      return handleDeleteNumber(roomNumber);
    }
    if (numbersSelected.length !== numberOfRoomsRequired) {
      return setNumbersSelected([...numbersSelected, roomNumber]);
    }
  };
  React.useEffect(() => {
    setValue('roomsIds', numbersSelected);
  }, [numbersSelected]);
  return (
    <Box sx={{ position: 'relative' }}>
      {disable && (
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            zIndex: 10,
            backgroundColor: '#fff',
            opacity: 0.5,
          }}
        />
      )}
      <Box sx={styles.withIconLabel}>
        <AccountBalanceWalletIcon />
        <Typography
          id="transition-modal-title"
          variant="subtitle1"
          component="h3"
        >
          Payment
        </Typography>
      </Box>
      <Grid container spacing={1} sx={{ my: 1 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            id="totalCost"
            fullWidth
            defaultValue={0}
            {...register('totalCost', {
              required: 'The total cost is required',
              min: {
                value: 0,
                message: 'The total cost must be a positive number',
              },
            })}
            variant="outlined"
            label={
              errors['totalCost'] ? errors['totalCost'].message : 'Total Cost'
            }
            type="number"
            error={errors['totalCost'] ? true : false}
            InputProps={{
              inputProps: { min: 0 },
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="payment-method">Payment Method</InputLabel>

            <Select
              labelId="payment-method"
              label="Payment Method"
              value={paymentMethodSelected}
              onChange={handlePaymentMethodField}
              sx={{ textTransform: 'capitalize' }}
            >
              {paymentMethods.map((type: { name: string; value: string }) => (
                <MenuItem
                  key={type.value}
                  value={type.value}
                  sx={{ textTransform: 'capitalize' }}
                >
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <input
            {...register('paymentMethod')}
            value={paymentMethodSelected}
            type="hidden"
          />
        </Grid>
      </Grid>
      <Box sx={styles.withIconLabel}>
        <KingBedIcon />
        <Typography
          id="transition-modal-title"
          variant="subtitle1"
          component="h3"
        >
          Available Rooms
        </Typography>
      </Box>
      <Grid
        item
        xs={12}
        sx={{
          mt: 2,

          py: 2,
          px: 1,
          border: errors['roomsIds']
            ? '1px solid  #f32f2f'
            : '1px solid rgb(196 196 196)',
          borderRadius: 1,
        }}
      >
        <Typography
          variant="body2"
          color={errors['roomsIds'] ? '#f32f2f' : 'text.secondary'}
          sx={{
            mb: 1,
            px: 1,
            fontSize: '12px',
            mt: '-18px',
            width: 'max-content',
            backgroundColor: '#fff',
            textTransform: 'capitalize',
          }}
        >
          {errors['roomsIds']
            ? errors['roomsIds'].message
            : 'Select the rooms to reserve'}
        </Typography>
        {availableRooms.length > 0 ? (
          <Stack direction="row" sx={{ flexWrap: 'wrap', gap: '6px', py: 1 }}>
            {availableRooms.map((room) => (
              <Chip
                label={room.number}
                key={room.id}
                color={
                  Boolean(numbersSelected.includes(parseInt(room.id)))
                    ? 'primary'
                    : 'default'
                }
                onClick={() => {
                  handleAddMoreRooms(parseInt(room.id));
                }}
              />
            ))}
          </Stack>
        ) : (
          <Typography
            color="secondary.main"
            sx={{
              textAlign: 'center',
              fontWeight: 500,
              py: disable && 1,
            }}
          >
            {disable ? '' : 'No available rooms were found.'}
          </Typography>
        )}

        <input {...register('roomsIds')} type="hidden" />
      </Grid>
    </Box>
  );
}
