import { ReactNode } from "react";
import { useDisclosure } from "@mantine/hooks";
import { ActionIcon, Modal } from "@mantine/core";
type ModalButtonProps = {
  children: ReactNode;
  icon: ReactNode;
  modalHeading?: string;
};
export default function ModalButton({
  children,
  icon,
  modalHeading,
}: ModalButtonProps) {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <ActionIcon onClick={open}>{icon}</ActionIcon>
      <Modal
        opened={opened}
        onClose={close}
        title={modalHeading}
        overlayProps={{
          backgroundOpacity: 0.35,
          blur: 4,
        }}
        size="sm"
      >
        {children}
      </Modal>
    </>
  );
}
