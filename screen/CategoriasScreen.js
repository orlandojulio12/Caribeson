import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Banner from './banner';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const CategoriesScreen = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://caribeson.com/CONEXION/getCategorias.php');
        const result = await response.json();
        setCategories(result);
        setFilteredCategories(result);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const filtered = categories.filter(category =>
      category.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchQuery, categories]);

  return (
    <View style={styles.container}>
      <Banner />
      <TextInput
        style={styles.searchBar}
        placeholder="Buscar categoría..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {filteredCategories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={styles.categoryItem}
            onPress={() => navigation.navigate('CancionesCategoria', { categoryId: category.id })}
          >
            <Text style={styles.categoryTitle}>{category.nombre}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {
    paddingBottom: 20,
  },
  searchBar: {
    fontSize: 16,
    padding: 10,
    margin: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
  },
  categoryItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CategoriesScreen;
