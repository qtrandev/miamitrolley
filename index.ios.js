/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  ScrollView,
  MapView,
  PropTypes,
  Image,
  Text,
  TouchableHighlight,
  View,
  TabBarIOS,
  ListView
} from 'react-native';

class miamitrolley extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: props.markers,
      selectedTab: 'one'
    };
  }
  componentDidMount() {
    this.refresh();
    setTimeout(
      () => { this.refresh(); },
      5000
    );
  }
  render() {
    return (
      <View style={styles.container}>
      <TabBarIOS
        selectedTab={this.state.selectedTab}>
        <TabBarIOS.Item
        title="Routes"
        systemIcon='bookmarks'
        selected={this.state.selectedTab === 'zero'}
        onPress={() => {
          this.setState({
            selectedTab: 'zero',
          });
        }}>
          <RoutesView />
        </TabBarIOS.Item>
          <TabBarIOS.Item
            title="Map"
            systemIcon='more'
            selected={this.state.selectedTab === 'one'}
            onPress={() => {
              this.setState({
                selectedTab: 'one',
              });
            }}>
            <View style={styles.tabcontainer}>
              <MapView
              style={styles.map}
              region={{
                latitude: 25.8011413,
                longitude: -80.2044014,
                latitudeDelta: 0.18,
                longitudeDelta: 0.18
              }}
              annotations={this.state.markers}/>
              <TouchableHighlight
                style={styles.button}
                onPress={() => this.refresh()}
                underlayColor='#bbbbbb'>
                  <Text style={styles.buttonText}>
                    Refresh
                  </Text>
              </TouchableHighlight>
            </View>
          </TabBarIOS.Item>
          <TabBarIOS.Item
          title="Favorites"
          systemIcon='favorites'
          selected={this.state.selectedTab === 'two'}
          onPress={() => {
            this.setState({
              selectedTab: 'two',
            });
          }}>
            <FavoritesView />
          </TabBarIOS.Item>
        </TabBarIOS>
      </View>
    );
  }
  refresh() {
    fetch('https://miami-transit-api.herokuapp.com/api/trolley/vehicles.json')
      .then((response) => response.json())
      .then((responseJson) => {
        var newMarkers = [];
        var trolleys = responseJson.get_vehicles;
        var count = trolleys.length;
        for (i = 0; i < count; i++) {
          trolleys[i].receiveTime = (new Date(trolleys[i].receiveTime)).toLocaleString();
          newMarkers.push(
            {
              latitude: trolleys[i].lat,
              longitude: trolleys[i].lng,
              title: 'Vehicle ID: '+trolleys[i].equipmentID,
              subtitle: 'Route: '+trolleys[i].routeID + ', Time: '+trolleys[i].receiveTime
            }
          );
        }
        this.setState({ markers: newMarkers });
      })
      .catch((error) => {
        console.error(error);
      });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  tabcontainer: {
    flex: 1,
    marginBottom: 50
  },
  map: {
    flex: 1
  },
  button: {
    height: 36,
    backgroundColor: '#123456',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    margin: 2,
    borderRadius: 5
  },
  buttonText: {
    fontSize: 18,
    color: '#fff'
  },
  rowText1: {
    padding: 10,
    fontSize: 36,
    color: 'blue'
  },
  rowText2: {
    padding: 10,
    fontSize: 24,
    color: 'green'
  }
});

miamitrolley.defaultProps = {
  markers: []
};

class RoutesView extends Component {
  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([
        'Allapattah',
        'Biscayne',
        'Coral Way',
        'Health District',
        'Overtown',
        'Stadium',
        'Coconut Grove',
        'Little Havana',
        'Wynwood'
      ])
    };
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(rowData) => <Text style={styles.rowText1}>{rowData}</Text>}
      />
    );
  }
}

class FavoritesView extends Component {
  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([
        'Allapattah',
        'Biscayne'
      ])
    };
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(rowData) => <Text style={styles.rowText2}>{rowData}</Text>}
      />
    );
  }
}

AppRegistry.registerComponent('miamitrolley', () => miamitrolley);
