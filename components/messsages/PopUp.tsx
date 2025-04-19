import React from 'react';
import { View } from 'react-native';
import { Modal, Portal, PaperProvider } from 'react-native-paper';

export default function PopUp({ visible, setVisible, children }: { children: React.ReactNode, visible: boolean, setVisible: React.Dispatch<React.SetStateAction<boolean>> }) {
	const hideModal = () => setVisible(false);

	return (
		<Portal>
			<PaperProvider>
				<Modal
					visible={visible}
					onDismiss={hideModal}
				>
					<View style={{ backgroundColor: 'white', padding: 16, marginHorizontal: 16, borderRadius: 12 }}>
						{children}
					</View>
				</Modal>
			</PaperProvider>
		</Portal>
	);
}


