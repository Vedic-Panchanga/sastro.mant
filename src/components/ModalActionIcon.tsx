import { ReactNode } from "react";
import { useDisclosure } from "@mantine/hooks";
import { ActionIcon, Modal } from "@mantine/core";
import { IconQuestionMark } from "@tabler/icons-react";
type ModalButtonProps = {
  children: ReactNode;
  modalHeading?: string;
};
//only used by question mark icon by now
export default function ModalActionIcon({
  children,
  modalHeading,
}: ModalButtonProps) {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <ActionIcon onClick={open} size="xs" variant="outline" radius="lg">
        {<IconQuestionMark />}
      </ActionIcon>
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
