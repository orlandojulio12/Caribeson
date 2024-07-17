// styles.js
import { StyleSheet } from 'react-native';

const baseStyles = {
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  card: {
    flexDirection: 'row',
    borderRadius: 10,
    margin: 10,
    padding: 10,
    alignItems: 'center',
  },
  cardLeft: {
    justifyContent: 'flex-start',
  },
  cardRight: {
    justifyContent: 'flex-end',
  },
  image: {
    width: 80,
    height: 80,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 18,
  },
  description: {
    marginBottom: 5,
  },
  viewMore: {
    marginTop: 5,
    fontWeight: 'bold',
  },
  date: {},
};

export const lightStyles = StyleSheet.create({
  ...baseStyles,
  container: {
    ...baseStyles.container,
    backgroundColor: 'white',
  },
  searchContainer: {
    ...baseStyles.searchContainer,
    backgroundColor: 'white',
    borderColor: 'gray',
  },
  card: {
    ...baseStyles.card,
    backgroundColor: '#F9E4DB',
  },
  title: {
    ...baseStyles.title,
    color: '#E86A1D',
  },
  description: {
    ...baseStyles.description,
    color: '#000',
  },
  viewMore: {
    ...baseStyles.viewMore,
    color: '#E86A1D',
  },
  date: {
    ...baseStyles.date,
    color: '#000',
  },
});

export const darkStyles = StyleSheet.create({
  ...baseStyles,
  container: {
    ...baseStyles.container,
    backgroundColor: '#1E1E1E',
  },
  searchContainer: {
    ...baseStyles.searchContainer,
    backgroundColor: '#333',
    borderColor: 'gray',
  },
  card: {
    ...baseStyles.card,
    backgroundColor: '#2E2E2E',
  },
  title: {
    ...baseStyles.title,
    color: '#FF9E45',
  },
  description: {
    ...baseStyles.description,
    color: '#CCC',
  },
  viewMore: {
    ...baseStyles.viewMore,
    color: '#FF9E45',
  },
  date: {
    ...baseStyles.date,
    color: '#CCC',
  },
});
