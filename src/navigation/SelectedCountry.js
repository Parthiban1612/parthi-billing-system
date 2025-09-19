import React from 'react';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';

/**
 * Higher-Order Component that provides selected country data to wrapped components
 * 
 * @param {React.Component} WrappedComponent - The component to wrap
 * @param {Object} options - Configuration options
 * @param {boolean} options.requireCountry - Whether the component requires a country to be selected
 * @param {React.Component} options.fallbackComponent - Component to render when no country is selected (if requireCountry is true)
 * @returns {React.Component} Enhanced component with selected country props
 * 
 * Usage Example:
 * ```javascript
 * import withSelectedCountry from './SelectedCountry';
 * 
 * function MyComponent({ submittedCountry, selectedCountry, selectedCity }) {
 *   return (
 *     <View>
 *       <Text>Country: {submittedCountry?.data?.name}</Text>
 *       <Text>Selected: {selectedCountry?.name}</Text>
 *     </View>
 *   );
 * }
 * 
 * export default withSelectedCountry(MyComponent);
 * 
 * // With options
 * export default withSelectedCountry(MyComponent, {
 *   requireCountry: true,
 *   fallbackComponent: () => <Text>Please select a country first</Text>
 * });
 * ```
 */
const withSelectedCountry = (WrappedComponent, options = {}) => {
  const {
    requireCountry = false,
    fallbackComponent: FallbackComponent = null
  } = options;

  const WithSelectedCountryComponent = (props) => {
    const { submittedCountry, selectedCountry, selectedCity } = useSelector(state => ({
      submittedCountry: state.travelCountries.submittedCountry,
      selectedCountry: state.travelCountries.selectedCountry,
      selectedCity: state.travelCountries.selectedCity
    }));

    // If country is required but not available, render fallback
    if (requireCountry && !submittedCountry?.data && !selectedCountry) {
      if (FallbackComponent) {
        return <FallbackComponent {...props} />;
      }
      return null;
    }

    // Pass country data as props to the wrapped component
    return (
      <WrappedComponent
        {...props}
        submittedCountry={submittedCountry}
        selectedCountry={selectedCountry}
        selectedCity={selectedCity}
      />
    );
  };

  // Set display name for debugging
  WithSelectedCountryComponent.displayName = `withSelectedCountry(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithSelectedCountryComponent;
};

// Export both the HOC and a default component for backward compatibility
export default withSelectedCountry;

// Export the HOC function for named imports
export { withSelectedCountry };

// Default component for backward compatibility (can be removed if not needed)
export const SelectedCountry = withSelectedCountry(({ submittedCountry, selectedCountry, selectedCity }) => {
  return (
    <View>
      <Text>SelectedCountry</Text>
      {submittedCountry?.data && (
        <Text>Submitted: {submittedCountry.data.name}</Text>
      )}
      {selectedCountry && (
        <Text>Selected: {selectedCountry.name}</Text>
      )}
      {selectedCity && (
        <Text>City: {selectedCity.name || selectedCity}</Text>
      )}
    </View>
  );
});
