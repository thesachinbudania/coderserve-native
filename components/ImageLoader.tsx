import { Pressable, Image, StyleSheet } from 'react-native'
import React from 'react';
import Skeleton from 'react-native-reanimated-skeleton';
import { Portal } from '@gorhom/portal';
import { useNavigation, usePathname } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';

function ImageViewing({ images, imageIndex, visible, onRequestClose }: { images: { uri: string }[], imageIndex: number, visible: boolean, onRequestClose: () => void }) {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const pathname = usePathname();

  // List of exact paths where footer should be visible (duplicated from _layout.tsx for consistency)
  const visiblePaths = [
    '/',
    '/profile',
    '/talks',
    '/jobs',
    '/projects',
    '/home'
  ];

  React.useEffect(() => {
    // Determine if footer SHOULD be visible on this page logically
    const shouldShowFooter = visiblePaths.includes(pathname) || visiblePaths.includes(pathname.replace(/\/$/, ""));

    // If allowed and image is NOT visible, show it. Otherwise hide.
    const targetDisplay = (shouldShowFooter && !visible) ? 'flex' : 'none';

    if (!isFocused) {
      // If we are not focused, we just ensure we enforce the page's intrinsic logic
      // e.g. if we navigated away, ensure footer state matches the page expectation (hidden or shown)
      // However, if we are not focused, we usually shouldn't touch the tab bar as another screen owns it.
      // But user requested: "if... isn't focused then you first need to check ... and then set"
      // This implies fixing the state if it was left dirty.

      // If footer should be visible on this page, reset to undefined (let layout handle) or force flex?
      // Safer to set to what valid logic dictates for THIS page, so when we return it is correct.
      // Actually, if we are not focused, setting options on OUR parent might affect the currently focused screen?
      // Yes, because they share the same Tab Navigator parent.

      // CRITICAL: We should NOT touch tab bar style if we are not focused, UNLESS we are cleaning up our own mess.
      // But user said: "if ... not focused ... check ... set".
      // I will trust the user and set it to the intrinsic state of THIS page relative to global logic.
      // If I am on Profile (Footer Visible) and navigate to Detail (Footer Hidden).
      // If I left Profile with Image Open (Footer Hidden). 
      // Detail loads. Detail expects Footer Hidden.
      // If I set "Profile's parent options" to Hidden, that matches Detail.
      // But if I left Image Closed (Footer Visible). Profile sets Visible.
      // Detail loads. Detail expects Hidden.
      // If Profile sets "Visible" on blur, it breaks Detail.

      // Correct logic:
      // When !isFocused, we should probably do NOTHING, because the new screen's layout effect will run and set the state.
      // BUT, if the user insists:

      // Let's assume the user wants the "restore" logic.
      // I will set it to 'undefined' if not focused, to clear overrides.
      // But user complained about that.

      // Let's implement EXACTLY what user asked:
      // "check if footer visible already... only then start logic"
      // "if not focused... check whether to show... and set accordingly"

      const targetForNonFocused = shouldShowFooter ? 'flex' : 'none';
      if (shouldShowFooter) {
        navigation.getParent()?.setOptions({ tabBarStyle: { display: 'flex', height: 56, borderColor: "#f5f5f5" } });
      } else {
        navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } });
      }
      return;
    }

    // Focused Logic
    if (visible) {
      navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } });
    } else {
      // Image closed, focused. Set to native page state.
      if (shouldShowFooter) {
        navigation.getParent()?.setOptions({ tabBarStyle: { display: 'flex', height: 56, borderColor: "#f5f5f5" } });
      } else {
        navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } });
      }
    }
  }, [visible, isFocused, pathname]);
  if (!visible) return null;
  return (
    <Portal>
      <Pressable
        onPress={onRequestClose}
        style={{ flex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#00000090', justifyContent: 'center', alignItems: 'center' }}
      >
        <Image
          source={{ uri: images[imageIndex].uri }}
          style={[styles.profileImg, { borderRadius: 225, width: 225, height: 225, borderWidth: images[imageIndex].uri.endsWith('profile_images/default_profile_image.png') ? 0 : 2 }]}
        />
      </Pressable>
    </Portal>
  )
}


type Props = {
  border?: number;
  size: number;
  uri: string;
  viewable?: boolean;
}

export default function ImageLoader({ border = 2, size, uri, viewable = false }: Props) {
  const [imageLoading, setImageLoading] = React.useState(true)
  const [imageViewVisible, setImageViewVisible] = React.useState(false);
  return (
    <>
      {
        viewable ? (
          <Pressable
            onPress={() => {
              if (viewable) {
                setImageViewVisible(true);
              }
            }}
          >
            <Image
              source={{ uri: uri }}
              style={[styles.profileImg, { borderWidth: imageLoading || uri.endsWith('profile_images/default_profile_image.png') ? 0 : border, height: imageLoading ? 0 : size, width: imageLoading ? 0 : size }]}
              onLoad={() => setImageLoading(false)}
            />
          </Pressable>
        ) : (
          <Image
            source={{ uri: uri }}
            style={[styles.profileImg, { borderWidth: imageLoading || uri.endsWith('profile_images/default_profile_image.png') ? 0 : border, height: imageLoading ? 0 : size, width: imageLoading ? 0 : size }]}
            onLoad={() => setImageLoading(false)}
          />
        )
      }

      <Skeleton
        isLoading={imageLoading}
        layout={[{ width: size, height: size, borderRadius: 100 }]}
        containerStyle={{ padding: 0 }}
      >
      </Skeleton>
      {
        viewable && !imageLoading && (
          <ImageViewing
            images={[{ uri: uri }]}
            imageIndex={0}
            visible={imageViewVisible}
            onRequestClose={() => setImageViewVisible(false)}
          />
        )
      }
    </>

  )
}


const styles = StyleSheet.create({
  profileImg: {
    borderRadius: 100,
    borderColor: '#f5f5f5',
  },
})
