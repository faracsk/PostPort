import Exponent, { Components } from 'exponent';
import React, { Component, PropTypes } from 'react';
import { View } from 'react-native';
import Carousel from 'react-native-snap-carousel';


const propTypes = {
};

class Map extends Component {
  static navigationOptions = {
    tabBar: {
      label: 'Map',
      tabBarPosition: 'bottom',
    },
  }

  state = {
    region: {
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
  };

  componentWillMount() {
    const { Location, Permissions } = Exponent;
    Permissions.askAsync(Permissions.LOCATION)
    .then((response) => {
      const { status } = response;
      if (status === 'granted') {
        Location.getCurrentPositionAsync({ enableHighAccuracy: true })
        .then((location) => {
          this.setState({
            region: {
              ...this.state.region,
              ...location.coords,
            },
          });
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Components.MapView
          style={{ flex: 1 }}
          region={this.state.region}
        >
          {
            this.props.posts.map((post) => {
              if (post.place) {
                const place = this.props.places[post.place];

                return (
                  <Components.MapView.Marker
                    key={post.id}
                    coordinate={{
                      latitude: place.location.latitude,
                      longitude: place.location.longitude,
                    }}
                    title={place.name}
                    description={`${place.location.city}, ${place.location.country}`}
                  />
                );
              }
              return null;
            })
          }
        </Components.MapView>
      </View>
    );
  }
}

Map.propTypes = propTypes;

export default Map;
