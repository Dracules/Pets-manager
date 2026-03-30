import { Menu, MenuItem, Sidebar } from 'react-pro-sidebar';
import { Link } from 'react-router';
import { useAuth } from '../../domains/login/context/AuthContext';
import { useState } from 'react';
import { FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';
import {
  TbCircleLetterA,
  TbCircleLetterL,
  TbCircleLetterM,
} from 'react-icons/tb';
import { RxExit } from 'react-icons/rx';

export function AppSidebar() {
  const { token, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Sidebar collapsed={collapsed} style={{ backgroundColor: '#f6f6f6ff' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <Menu>
          <MenuItem
            icon={collapsed ? <FiChevronsRight /> : <FiChevronsLeft />}
            onClick={() => setCollapsed(!collapsed)}
          ></MenuItem>
        </Menu>
        <Menu style={{ flex: 1, overflowY: 'auto', margin: 0 }}>
          <MenuItem
            icon={<TbCircleLetterA size={35} />}
            component={<Link to="/" />}
          >
            All animals
          </MenuItem>
          {token && (
            <>
              <MenuItem
                icon={<TbCircleLetterM size={35} />}
                component={<Link to="/mycats" />}
              >
                My animals
              </MenuItem>
            </>
          )}
        </Menu>
        <Menu>
          {token ? (
            <MenuItem icon={<RxExit size={35} />} onClick={logout}>
              Logout
            </MenuItem>
          ) : (
            <MenuItem
              icon={<TbCircleLetterL size={35} />}
              component={<Link to="/login" />}
            >
              Login
            </MenuItem>
          )}
        </Menu>
      </div>
    </Sidebar>
  );
}
