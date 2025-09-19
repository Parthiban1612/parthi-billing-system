import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';

const FavCard = ({
  item,
  onPress,
  showBanner = false,
  gradientColors = ['#F5F6F9', '#FBE314'],
  style
}) => {
  const CardContent = () => (
    <TouchableRipple
      onPress={onPress}
      rippleColor={`rgba(60,60,60,0.12)`}
      style={styles.Itemcard}
      borderless={true}
    >
      <>
        <Image
          source={{ uri: item?.images[0]?.image }}
          style={styles.itemImage}
        />
        <View style={styles.textContainer}>
          <Text style={styles.cardTitle}>{item?.name}</Text>
          <Text style={styles.cardDescription} numberOfLines={1} ellipsizeMode="tail">
            {item?.description}
          </Text>
          <TouchableOpacity style={styles.tag}>
            <Text style={styles.tagText}>{item?.category}</Text>
          </TouchableOpacity>
        </View>
      </>
    </TouchableRipple>
  );

  if (showBanner) {
    return (
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={[styles.outerContainer, style]}
      >
        <Text style={styles.bannerText}>Don't miss this</Text>
        <CardContent />
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.outerContainer, style]}>
      <CardContent />
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    width: '90%',
    borderRadius: 16,
    paddingTop: 12,
    paddingBottom: 0,
    paddingHorizontal: 2,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 9,
    shadowColor: '#B9B7B7',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginHorizontal: "auto",
  },
  Itemcard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: "flex-start",
    padding: 8,
    width: '100%',
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  bannerText: {
    textAlign: 'center',
    fontSize: 11,
    color: '#333',
    marginBottom: 8,
    fontFamily: "instrument-sans-700",
  },
  cardTitle: {
    fontSize: 17,
    color: '#3B3842',
    marginBottom: 4,
    fontFamily: "clash-display-600"
  },
  cardDescription: {
    marginBottom: 12,
    fontSize: 15,
    color: '#757087',
    fontFamily: "instrument-sans-400",
  },
  tag: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  tagText: {
    padding: 8,
    fontSize: 11,
    color: '#4B5563',
    fontFamily: "instrument-sans-500",
  },
});

export default FavCard; 