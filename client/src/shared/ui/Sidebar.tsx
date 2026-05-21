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

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const { token, logout } = useAuth();
  const iconSize = 30;

  return (
    <Sidebar
      collapsed={collapsed}
      backgroundColor="#f6f6f6"
      rootStyles={{ height: '100%', width: collapsed ? '80px' : '260px' }}
    >
      <div>
        <div>
          <Menu>
            <MenuItem
              icon={
                <div>
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

        <div>
          <Menu>
            <MenuItem
              icon={
                <div>
                  <TbCircleLetterA size={iconSize} />
                </div>
              }
              component={<Link to="/" />}
            >
              All animals
            </MenuItem>

            {token.access_token && (
              <>
                <MenuItem
                  icon={
                    <div>
                      <TbCircleLetterM size={iconSize} />
                    </div>
                  }
                  component={<Link to="/my" />}
                >
                  My animals
                </MenuItem>
                <MenuItem
                  icon={
                    <div>
                      <IoMdAddCircleOutline size={iconSize} />
                    </div>
                  }
                  component={<Link to="/edit" />}
                >
                  Add animal
                </MenuItem>
              </>
            )}
          </Menu>
        </div>

        <div>
          <Menu>
            {token.access_token ? (
              <MenuItem
                icon={
                  <div>
                    <RxExit size={iconSize} />
                  </div>
                }
                onClick={logout}
              >
                Logout
              </MenuItem>
            ) : (
              <MenuItem
                icon={
                  <div>
                    <TbCircleLetterL size={iconSize} />
                  </div>
                }
                component={<Link to="/login" />}
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
