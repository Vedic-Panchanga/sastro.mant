import { ReactNode } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Button, Modal } from "@mantine/core";
type ModalButtonProps = {
  children: ReactNode;
  buttonText: string;
  modalHeading?: string;
};
export default function ModalButton({
  children,
  buttonText,
  modalHeading,
}: ModalButtonProps) {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Button onClick={open}>{buttonText}</Button>
      <Modal
        opened={opened}
        onClose={close}
        title={modalHeading}
        overlayProps={{
          backgroundOpacity: 0.35,
          blur: 4,
        }}
        size="xs"
      >
        {children}
      </Modal>
    </>
  );
}
