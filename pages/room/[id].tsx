import type { NextPage } from 'next';
import Head from 'next/head';
import room from '@/mocks/roomModel';
import Box from '@mui/material/Box';
import DoneIcon from '@mui/icons-material/Done';
import Typography from '@mui/material/Typography';
import TodayIcon from '@mui/icons-material/Today';
import Button from '@mui/material/Button';
import ImageListItem from '@mui/material/ImageListItem';
import ImageList from '@mui/material/ImageList';
import AddIcon from '@mui/icons-material/Add';
import RoomPreferencesIcon from '@mui/icons-material/RoomPreferences';
import BedIcon from '@mui/icons-material/Bed';
import RoomServiceIcon from '@mui/icons-material/RoomService';
import Modal from '../../components/AbailableRoomModal';
const Room: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Hotel</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="page">
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 700,
            margin: '0 16px',
            width: 'fit-content',
            textTransform: 'capitalize',
            padding: '10px 0 0',
          }}
        >
          {room.hotel.name}
        </Typography>
        <Typography
          variant="h4"
          component="h2"
          color="primary"
          sx={{
            fontWeight: 700,
            margin: '0 16px',
            width: 'fit-content',
            textTransform: 'capitalize',
            padding: '10px 0 5px',
          }}
        >
          {room.category}
        </Typography>
        <ImageList
          sx={{
            width: '100%',
            maxHeight: '450px',
            overflow: 'hidden',
            objectFit: 'cover',
            objectPosition: 'center bottom',
          }}
          rowHeight={450}
          cols={1}
        >
          <ImageListItem cols={1}>
            <img
              src={`${room.mainImage}?w=248&fit=crop&auto=format`}
              srcSet={`${room.mainImage}?w=248&fit=crop&auto=format&dpr=2 2x`}
              alt={`${room.hotel.name} ${room.category}`}
              loading="lazy"
            />
          </ImageListItem>
        </ImageList>

        <h4 className="price">
          <span> ${room.lowestPrice} USD</span>/Night
        </h4>

        <Typography sx={{ margin: '20px 10px' }}>{room.description}</Typography>
        <div className="list">
          <div className="list-item">
            <TodayIcon color="primary" />
            <Typography>
              <span> minimun stays:</span>
              {`  ${room.minimunStays} nights`}
            </Typography>
          </div>
          <div className="list-item">
            <TodayIcon color="primary" />
            <Typography>
              <span>maximun stays:</span>
              {`  ${room.maximunStays} nights`}
            </Typography>
          </div>
        </div>
        <section className="container">
          <Box
            sx={{
              margin: '30px 0',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
                marginBottom: '15px',
              }}
            >
              <BedIcon color="primary" />

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 300,
                  textTransform: 'capitalize',
                }}
              >
                Beds
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                minWidth: 'max-content',
                textTransform: 'capitalize',
                margin: '15px',
              }}
            >
              <DoneIcon
                fontSize="small"
                color="secondary"
                sx={{
                  marginRight: '8px',
                }}
              />
              {room.beds.map((bed, index) => (
                <div key={bed.type}>
                  <Typography>
                    {bed.quantity} {bed.type}{' '}
                    {bed.quantity > 1 ? 'beds' : 'bed'}
                    {room.beds.length > 1 && index < room.beds.length - 1 && (
                      <AddIcon
                        fontSize="small"
                        color="secondary"
                        sx={{ margin: '0 5px -3px' }}
                      />
                    )}
                  </Typography>
                </div>
              ))}
            </Box>

            <Box
              sx={{
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
                marginBottom: '15px',
              }}
            >
              <RoomPreferencesIcon color="primary" />

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 300,
                  textTransform: 'capitalize',
                }}
              >
                Amenities
              </Typography>
            </Box>
            <div className="list">
              {room.amenities.map((item) => (
                <div key={item.id} className="list-item">
                  <DoneIcon fontSize="small" color="secondary" />
                  <Typography>{item.name}</Typography>
                </div>
              ))}
            </div>
            <Box
              sx={{
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
                my: 2,
              }}
            >
              <RoomServiceIcon color="primary" />

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 300,
                  textTransform: 'capitalize',
                }}
              >
                Services
              </Typography>
            </Box>
            <div className="list">
              {room.services.map((item) => (
                <div key={item.id} className="list-item">
                  <DoneIcon fontSize="small" color="secondary" />
                  <Typography>{item.name}</Typography>
                </div>
              ))}
            </div>
          </Box>
          <Modal roomId={room.id}>
            <Button
              sx={{ padding: '10px 20px' }}
              color="secondary"
              variant="contained"
              href="#"
            >
              Check Diponibility
            </Button>
          </Modal>
        </section>
      </main>
      <style jsx>
        {`
          .page {
            max-width: 1000px;
            margin: 20px auto;
          }

          .container {
            padding: 0 10px;
          }
          h5 {
            font-size: 18px;
            margin: 0;
          }
          .price {
            margin: 0 15px 10px 15px;
            margin-left: auto;
            max-width: fit-content;
            display: block;
            padding: 10px;
            font-weight: 200;
            font-size: 22px;
          }
          .price span {
            color: #3f51b5;
            font-weight: 700;
            margin-left: 5px;
          }
          .list {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
            padding: 0 10px;
            text-transform: capitalize;
            font-weight: 400;
          }
          span,
          .inportant {
            color: #3f51b5;
          }

          .list-item {
            display: flex;
            gap: 10px;
            align-items: center;
          }

          .list-item p {
            margin: 8px 0;
          }
        `}
      </style>
    </div>
  );
};

export default Room;
