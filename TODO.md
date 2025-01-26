- Figure out how to specify previews for Bluesky/Mastadon.

Updates for AvO-Adventure-mk3
- Update StarterStory.deconstructor() to include missing event un-listeners.
- Actually, maybe using `get assets()` in a Story isn't a good idea, since it'll generate a NEW object every time it's called.
- Tile's default paint() should also add a stroke.
- Maybe make Entity.state and Entity.stateTransition as a standard thing. Also add Entity.setState()? Or maybe use get state()/set state().
- main.scss is sometimes using hardcoded colour values instead of variables. e.g. .ui-button.
- Entity.paintSprite() should have args.spriteRotation.
- Entity.paintSprite() should also have args.spriteSizeX and args.spriteSizeY

LONG TERM
- Story should have a .finish() and a .deconstructor().