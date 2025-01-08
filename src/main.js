import AvO from '@avo'
import CNY2025 from './cny2025'

window.onload = function() {
  window.avo = new AvO({ story: CNY2025, width: 24 * 32, height: 24 * 32 })
}
