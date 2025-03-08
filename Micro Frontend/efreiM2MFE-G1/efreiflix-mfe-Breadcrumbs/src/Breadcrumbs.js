import * as React from "react";
import {
  BrowserRouter as Router,
  useLocation,
  Link as RouterLink,
} from "react-router-dom";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import HomeIcon from "@mui/icons-material/Home";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useState, useEffect } from "react";

function DynamicBreadcrumbs({ selectedGenre }) {
  const location = useLocation();
  if (!location || !location.pathname) return null;
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
    >
      <Link underline="hover" color="inherit" component={RouterLink} to="/">
        <HomeIcon fontSize="small" sx={{ verticalAlign: "middle", mb: 0.2 }} />
      </Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        return isLast ? (
          <Typography color="text.primary" key={to}>
            {value}
          </Typography>
        ) : (
          <Link
            underline="hover"
            color="inherit"
            component={RouterLink}
            to={to}
            key={to}
          >
            {value}
          </Link>
        );
      })}
      {selectedGenre && (
        <Typography color="text.primary">{selectedGenre}</Typography>
      )}
    </Breadcrumbs>
  );
}

function GenreDropdown({ selectedGenre, setSelectedGenre }) {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    fetch("http://0.0.0.0:2066/movies")
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => setBreadcrumbs(data))
      .catch(error => console.error("⚠ Erreur de récupération des breadcrumbs :", error));
  }, []);

  const handleChange = (event) => {
    setSelectedGenre(event.target.value);
  };

  return (
    <Box sx={{ margin: "20px", width: "300px" }}>
      <Typography variant="h6">Choisir un genre :</Typography>
      <Select
        fullWidth
        value={selectedGenre}
        onChange={handleChange}
        displayEmpty
      >
        <MenuItem value="">
          <em>Tout</em>
        </MenuItem>
        {genres.map((genre, index) => (
          <MenuItem key={index} value={genre}>
            {genre}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}

export default function NetflixNavBar() {
  const [selectedGenre, setSelectedGenre] = useState("");

  return (
    <Router>
      <AppBar
        position="static"
        sx={{ backgroundColor: "black", padding: "0 20px" }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontWeight: "bold",
              color: "red",
              fontSize: "24px",
            }}
          >
            EFREIFLIX
          </Typography>
          <Box sx={{ flexGrow: 1, display: "flex", gap: 3 }}>
            <Button color="inherit" component={RouterLink} to="/">
              Home
            </Button>
            <Button color="inherit" component={RouterLink} to="/tv-shows">
              TV Shows
            </Button>
            <Button color="inherit" component={RouterLink} to="/movies">
              Movies
            </Button>
            <Button color="inherit" component={RouterLink} to="/new-popular">
              New & Popular
            </Button>
            <Button color="inherit" component={RouterLink} to="/my-list">
              My List
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/browse-languages"
            >
              Browse by Languages
            </Button>
          </Box>
          <IconButton color="inherit">
            <SearchIcon />
          </IconButton>
          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>
          <Avatar sx={{ bgcolor: "red" }}>N</Avatar>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 2 }}>
        <DynamicBreadcrumbs selectedGenre={selectedGenre} />
        <GenreDropdown
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
        />
      </Box>
    </Router>
  );
}