import { ElementType } from 'react';
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import { ComponentPropsWithoutRef, FC } from 'react';

export type IconPropsWithoutName<
  IconType extends ElementType = typeof MaterialIcons,
> = Omit<ComponentPropsWithoutRef<IconType>, 'name'>;

type NameProp<Props> = Props extends { name: infer Name } ? Name : never;
type Curried<C extends ElementType, Props = ComponentPropsWithoutRef<C>> = (
  name: NameProp<Props>,
) => FC<Omit<Props, 'name'>>;

export type IconColor = ComponentPropsWithoutRef<typeof MaterialIcons>['color'];

export const materialIcon: Curried<typeof MaterialIcons> = (name) => (props) =>
  <MaterialIcons name={name} {...props} />;

export const materialCommunityIcon: Curried<typeof MaterialCommunityIcons> =
  (name) => (props) =>
    <MaterialCommunityIcons name={name} {...props} />;

export const ionIcon: Curried<typeof Ionicons> = (name) => (props) =>
  <Ionicons name={name} {...props} />;

export const ActivityIcon = materialCommunityIcon('chart-timeline-variant');
export const SendIcon = materialCommunityIcon('send');
export const ReceiveIcon = materialCommunityIcon('arrow-bottom-left');
export const ContactsIcon = materialIcon('people');
export const HomeIcon = ionIcon('wallet');
export const AddIcon = materialCommunityIcon('plus');
export const DeleteIcon = materialCommunityIcon('delete');
export const EditIcon = materialCommunityIcon('pencil');
export const AcceptIcon = materialCommunityIcon('check');
export const RejectIcon = materialCommunityIcon('close');
export const ScanIcon = materialCommunityIcon('line-scan');
export const MenuIcon = materialCommunityIcon('menu');
export const ShareIcon = materialCommunityIcon('share-variant');
export const CheckIcon = materialCommunityIcon('check');
export const FinalizedIcon = materialCommunityIcon('send-check');
export const CloseIcon = materialCommunityIcon('close');
export const CancelIcon = CloseIcon;
export const ErrorIcon = materialIcon('error');
export const RetryIcon = materialIcon('redo');
export const SwapIcon = materialCommunityIcon('swap-vertical');
export const SearchIcon = materialIcon('search');
export const PlusIcon = materialCommunityIcon('plus');
export const PlusCircleIcon = materialCommunityIcon('plus-circle-outline');
export const SettingsIcon = materialCommunityIcon('cog');
export const SettingsOutlineIcon = materialCommunityIcon('cog-outline');
export const PayIcon = materialCommunityIcon('contactless-payment');
export const PayCircleIcon = materialCommunityIcon(
  'contactless-payment-circle',
);
export const PayCircleOutlineIcon = materialCommunityIcon(
  'contactless-payment-circle-outline',
);
export const AccountIcon = materialCommunityIcon('bank');
export const WalletIcon = ionIcon('md-wallet');
export const BackIcon = materialIcon('arrow-back');
export const NextIcon = materialIcon('arrow-forward');
export const IssueIcon = materialCommunityIcon('github');
export const FeedbackIcon = materialCommunityIcon('chat');
export const TokenCurrencyIcon = materialCommunityIcon('currency-eth');
export const ChevronRight = materialIcon('chevron-right');
export const QuorumIcon = materialIcon('group');
export const DeployIcon = materialCommunityIcon('rocket-launch');
export const UndoIcon = materialIcon('undo');
