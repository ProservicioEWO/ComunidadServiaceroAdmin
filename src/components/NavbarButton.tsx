import {
  ComponentWithAs,
  Icon,
  IconButton,
  IconProps
  } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';

export interface NavbarButtonProps {
  href: string,
  icon?: ComponentWithAs<"svg", IconProps>
}

const NavbarButton = ({ href, icon }: NavbarButtonProps, props: any) => {
  const styles = {
    active: { stroke: 'gray.700', bg: 'white' },
    normal: { stroke: 'white', bg: 'transparent' }
  }
  
  return (
    <NavLink to={href}>
      {
        ({ isActive }) => (
          <IconButton
            {...props}
            {...(isActive ? styles.active : styles.normal)}
            icon={<Icon as={icon} boxSize='8' />}
            variant='ghost'
            _hover={styles.active} />
        )
      }
    </NavLink>
  )
}

export default NavbarButton