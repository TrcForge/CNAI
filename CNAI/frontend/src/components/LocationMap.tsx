import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

type LocationMapProps = {
  latitude: number
  longitude: number
  locationName: string
  timestamp: string
  source: string
  confidence: string
}

function locationMap({
  latitude,
  longitude,
  locationName,
  timestamp,
  source,
  confidence,
}: LocationMapProps) {
  return (
    <div className="h-full w-full overflow-hidden rounded-xl">
      <MapContainer
        center={[latitude, longitude]}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[latitude, longitude]}>
          <Popup>
            <div>
              <strong>{locationName}</strong>
              <br />
              Last traced: {timestamp}
              <br />
              Source: {source}
              <br />
              Confidence: {confidence}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}

export default locationMap