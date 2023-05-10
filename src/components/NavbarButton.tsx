import {
  ComponentWithAs,
  Icon,
  IconButton,
  IconProps,
  Tooltip
} from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';

export interface NavbarButtonProps {
  href: string,
  icon?: ComponentWithAs<"svg", IconProps>,
  text?: string
}

const NavbarButton = ({ href, icon, text }: NavbarButtonProps, props: any) => {
  const styles = {
    active: { stroke: 'gray.700', bg: 'white' },
    normal: { stroke: 'white', bg: 'transparent' }
  }

  return (
    <Tooltip hasArrow placement='right' label={text}>
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
    </Tooltip>
  )
}

export default NavbarButton