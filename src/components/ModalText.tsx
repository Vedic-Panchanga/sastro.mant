import { ReactNode } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";
type ModalButtonProps = {
  children: ReactNode;
  text: string;
  modalHeading?: string;
};
export default function ModalButton({
  children,
  text,
  modalHeading,
}: ModalButtonProps) {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Button onClick={open} variant="transparent">
        {text}
      </Button>
      <Modal
        opened={opened}
        onClose={close}
        title={modalHeading}
        overlayProps={{
          backgroundOpacity: 0.35,
          blur: 4,
        }}
        size="xl"
      >
        {children}
      </Modal>
    </>
  );
}
