- Figure out how to specify previews for Bluesky/Mastadon.

Updates for AvO-Adventure-mk3
- Update StarterStory.deconstructor() to include missing event un-listeners.
- Actually, maybe using `get assets()` in a Story isn't a good idea, since it'll generate a NEW object every time it's called.
- Tile's default paint() should also add a stroke.