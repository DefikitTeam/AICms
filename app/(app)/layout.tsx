import React from 'react';


import '@radix-ui/themes/styles.css';
import ExperimentalAlertDialog from './_components/experimental-alert-dialog';
import Sidebar from './_components/sidebar';

interface Props {
	children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <ExperimentalAlertDialog />
      <Sidebar>{children}</Sidebar>
    </>
	);
};

export default Layout;
