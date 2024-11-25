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
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 10; // Define cuántas categorías quieres mostrar por página
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://10.1.80.243/CONEXION/getCategorias.php');
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

  const getTotalPages = () => {
    return Math.ceil(filteredCategories.length / categoriesPerPage);
  };

  const getCurrentPageCategories = () => {
    const startIndex = (currentPage - 1) * categoriesPerPage;
    return filteredCategories.slice(startIndex, startIndex + categoriesPerPage);
  };

  const goToPrevPage = () => {
    setCurrentPage(Math.max(1, currentPage - 1));
  };

  const goToNextPage = () => {
    setCurrentPage(Math.min(getTotalPages(), currentPage + 1));
  };

  return (
    <View style={styles.container}>
      <Banner />
      <TextInput
        style={styles.searchBar}
        placeholder="Buscar categoría..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <ScrollView>
        {getCurrentPageCategories().map((category, index) => (
          <TouchableOpacity
            key={index}
            style={styles.categoryItem}
            onPress={() => navigation.navigate('CancionesCategoria', { categoryId: category.id })}
          >
            <Text style={styles.categoryTitle}>{category.nombre}</Text>
          </TouchableOpacity>
        ))}
          <View style={styles.paginationContainer}>
        <TouchableOpacity 
          style={[styles.paginationButton, { opacity: currentPage === 1 ? 0.5 : 1 }]}
          onPress={goToPrevPage}
          disabled={currentPage === 1}
        >
          <MaterialCommunityIcons name="chevron-left" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.paginationButton, { opacity: currentPage === getTotalPages() ? 0.5 : 1 }]}
          onPress={goToNextPage}
          disabled={currentPage === getTotalPages()}
        >
          <MaterialCommunityIcons name="chevron-right" size={30} color="black" />
        </TouchableOpacity>
      </View>
      </ScrollView>
    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  paginationButton: {
    padding: 10,
  },
});

export default CategoriesScreen;
