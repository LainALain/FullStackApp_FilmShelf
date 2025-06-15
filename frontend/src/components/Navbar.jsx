import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  useScrollTrigger,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../context/AuthContext';

// Хук для плавного изменения elevation и фона при скролле
function ElevationScroll({ children, window }) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });
  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
    color: trigger ? 'default' : 'transparent',
    sx: {
      transition: 'background-color 0.3s, box-shadow 0.3s',
      borderBottom: trigger ? '1px solid rgba(0,0,0,0.12)' : 'none',
    },
  });
}

function NavButton({ to, label, active, onClick }) {
  return (
    <Button
      component={Link}
      to={to}
      onClick={onClick}
      color="inherit"
      sx={{
        textTransform: 'none',
        fontWeight: active ? 600 : 400,
        mx: { xs: 0.5, sm: 1 },
        px: 1,
        position: 'relative',
        '&:hover': { backgroundColor: 'transparent' },
        '&::after': active && {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: '10%',
          width: '80%',
          height: '2px',
          bgcolor: 'primary.main',
          borderRadius: '2px',
        },
      }}
    >
      {label}
    </Button>
  );
}

export default function Navbar({ window }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    nav('/login');
    handleMenuClose();
  };

  const isActive = (path) => location.pathname === path;

  // Mobile menu handlers
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const menuItems = user
    ? [
        { label: 'Главная', to: '/' },
        { label: 'Топ 100', to: '/top' },
        { label: 'Профиль', to: `/user/${user.username}` },
        { label: 'Настройки', to: '/settings' },
        { label: 'Выйти', action: handleLogout },
      ]
    : [
        { label: 'Главная', to: '/' },
        { label: 'Топ 100', to: '/top' },
        { label: 'Вход', to: '/login' },
        { label: 'Регистрация', to: '/register' },
      ];

  return (
    <>
      <ElevationScroll window={window}>
        <AppBar position="fixed">
          <Toolbar sx={{ maxWidth: 1100, width: '100%', mx: 'auto', px: { xs: 1, sm: 2 } }}>
            <Typography
              component={Link}
              to="/"
              variant="h6"
              sx={{
                textDecoration: 'none',
                fontWeight: 700,
                flexGrow: 1,
                color: 'primary.main',
              }}
            >
              FilmShelf
            </Typography>

            {/* Desktop navigation */}
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
              {menuItems.map((item) =>
                item.to ? (
                  <NavButton
                    key={item.to}
                    to={item.to}
                    label={item.label}
                    active={isActive(item.to)}
                  />
                ) : (
                  <Button
                    key={item.label}
                    color="inherit"
                    onClick={item.action}
                    sx={{ textTransform: 'none', ml: 1 }}
                  >
                    {item.label}
                  </Button>
                )
              )}
            </Box>

            {/* Mobile menu */}
            <Box sx={{ display: { xs: 'flex', sm: 'none' } }}>
              <IconButton color="inherit" onClick={openMenu}>
                <MenuIcon />
              </IconButton>
              <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleMenuClose}>
                {menuItems.map((item) =>
                  item.to ? (
                    <MenuItem
                      key={item.to}
                      component={Link}
                      to={item.to}
                      onClick={handleMenuClose}
                      selected={isActive(item.to)}
                    >
                      {item.label}
                    </MenuItem>
                  ) : (
                    <MenuItem key={item.label} onClick={item.action}>
                      {item.label}
                    </MenuItem>
                  )
                )}
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <Toolbar />
    </>
  );
}
