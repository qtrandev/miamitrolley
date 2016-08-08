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
  View
} from 'react-native';

class miamitrolley extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: props.markers
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
});

miamitrolley.defaultProps = {
  markers: []
};

AppRegistry.registerComponent('miamitrolley', () => miamitrolley);
