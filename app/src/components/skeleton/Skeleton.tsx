import { useTheme } from '@theme/paper';
import ContentLoader, {
  IContentLoaderProps,
} from 'react-content-loader/native';
import { NumberProp } from 'react-native-svg';

export type SkeletonProps = IContentLoaderProps & {
  width: NumberProp;
  height: NumberProp;
};

/*
 * Skeleton generator: https://skeletonreact.com
 */
export const Skeleton = ({
  children,
  width,
  height,
  ...props
}: SkeletonProps) => {
  const { colors } = useTheme();

  return (
    <ContentLoader
      speed={2}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      backgroundColor={colors.surfaceVariant}
      foregroundColor={colors.secondary}
      {...props}
    >
      {children}
    </ContentLoader>
  );
};
