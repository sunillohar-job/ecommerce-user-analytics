import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import "./AppNavigationLinks.less";

export interface INavigationLinks {
  id: string;
  label: string;
  Icon?: React.ElementType;
  Page?: React.FC;
}

interface AppNavigationLinksProps {
  navigationLinks: INavigationLinks[];
  onClick: (navigationLink: INavigationLinks) => void;
  active?: INavigationLinks;
}

const AppNavigationLinks:React.FC<AppNavigationLinksProps> = ({
  navigationLinks = [],
  onClick,
  active
}) => {
  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <nav className='app-navigation-container'>
        <List>
          {navigationLinks.map((navDetails) => (
            <ListItem key={navDetails?.id} disablePadding className={navDetails?.id === active?.id ? 'active-navigation' : ''}>
              <ListItemButton onClick={() => onClick(navDetails)}>
                <ListItemIcon>
                  {navDetails?.Icon && <navDetails.Icon /> }
                </ListItemIcon>
                <ListItemText primary={navDetails?.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </nav>
    </Box>
  );
}

export default AppNavigationLinks;
