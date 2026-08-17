import { Menu, MenuItem, Sidebar } from 'react-pro-sidebar';
import { Link } from 'react-router';
import { useAuth } from '../../domains/login/context/AuthContext';
import { FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';
import {
  TbCircleLetterA,
  TbCircleLetterL,
  TbCircleLetterM,
} from 'react-icons/tb';
import { RxExit } from 'react-icons/rx';
import { IoMdAddCircleOutline } from 'react-icons/io';
import styles from './css/AppSidebar.module.css';
import { memo } from 'react';

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const { token, logout } = useAuth();
  const iconSize = 30;

  return (
    <Sidebar
      collapsed={collapsed}
      backgroundColor="#f6f6f6"
      rootStyles={{ height: '100%', width: collapsed ? '80px' : '260px' }}
    >
      <div className={styles.layout}>
        <div className={styles.top}>
          <Menu>
            <MenuItem
              className={styles.menuItem}
              icon={
                <div className={styles.iconBox}>
                  {collapsed ? (
                    <FiChevronsRight size={iconSize} />
                  ) : (
                    <FiChevronsLeft size={iconSize} />
                  )}
                </div>
              }
              onClick={() => onToggle()}
            />
          </Menu>
        </div>

        <div className={styles.middle}>
          <Menu>
            <MenuItem
              className={styles.menuItem}
              icon={
                <div className={styles.iconBox}>
                  <TbCircleLetterA size={iconSize} />
                </div>
              }
              component={<Link to="/" className={styles.navLink} />}
            >
              All animals
            </MenuItem>

            {token.access_token && (
              <>
                <MenuItem
                  className={styles.menuItem}
                  icon={
                    <div className={styles.iconBox}>
                      <TbCircleLetterM size={iconSize} />
                    </div>
                  }
                  component={<Link to="/my/" className={styles.navLink} />}
                >
                  My animals
                </MenuItem>
                <MenuItem
                  className={styles.menuItem}
                  icon={
                    <div className={styles.iconBox}>
                      <IoMdAddCircleOutline size={iconSize} />
                    </div>
                  }
                  component={<Link to="/edit" className={styles.navLink} />}
                >
                  Add animal
                </MenuItem>
              </>
            )}
          </Menu>
        </div>

        <div className={styles.bottom}>
          <Menu>
            {token.access_token ? (
              <MenuItem
                className={styles.menuItem}
                icon={
                  <div className={styles.iconBox}>
                    <RxExit size={iconSize} />
                  </div>
                }
                onClick={logout}
              >
                Logout
              </MenuItem>
            ) : (
              <MenuItem
                className={styles.menuItem}
                icon={
                  <div className={styles.iconBox}>
                    <TbCircleLetterL size={iconSize} />
                  </div>
                }
                component={<Link to="/login" className={styles.navLink} />}
              >
                Login
              </MenuItem>
            )}
          </Menu>
        </div>
      </div>
    </Sidebar>
  );
}

export default memo(AppSidebar);
