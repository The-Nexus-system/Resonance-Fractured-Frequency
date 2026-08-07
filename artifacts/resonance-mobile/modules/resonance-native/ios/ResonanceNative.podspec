Pod::Spec.new do |s|
  s.name           = 'ResonanceNative'
  s.version        = '1.0.0'
  s.summary        = 'Native ARKit/RealityKit rendering and true 3-D spatial audio for Resonance: Fractured Frequency'
  s.description    = 'Presentation-only native layer: consumes the semantic world state owned by the JS engine.'
  s.author         = 'The Nexus System'
  s.homepage       = 'https://github.com/The-Nexus-system/Resonance-Fractured-Frequency'
  s.license        = 'MIT'
  s.platforms      = { :ios => '15.1' }
  s.swift_version  = '5.4'
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
  }

  s.source_files = "**/*.{h,m,swift}"
end
