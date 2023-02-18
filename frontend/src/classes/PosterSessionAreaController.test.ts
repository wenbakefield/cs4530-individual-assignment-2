import { mock, mockClear, MockProxy } from 'jest-mock-extended';
import { nanoid } from 'nanoid';
import { PosterSessionArea } from '../generated/client';
import TownController from './TownController';
import PosterSessionAreaController, {
  PosterSessionAreaEvents,
} from './PosterSessionAreaController';

describe('PosterSessionAreaController', () => {
  // A valid PosterSessionArea to be reused within the tests
  let testArea: PosterSessionAreaController;
  let testAreaModel: PosterSessionArea;
  const townController: MockProxy<TownController> = mock<TownController>();
  const mockListeners = mock<PosterSessionAreaEvents>();
  beforeEach(() => {
    testAreaModel = {
      id: nanoid(),
      title: nanoid(),
      imageContents: nanoid(),
      stars: 1,
    };
    testArea = new PosterSessionAreaController(testAreaModel);
    mockClear(townController);
    mockClear(mockListeners.posterImageContentsChange);
    mockClear(mockListeners.posterStarChange);
    mockClear(mockListeners.posterTitleChange);
    testArea.addListener('posterTitleChange', mockListeners.posterTitleChange);
    testArea.addListener('posterImageContentsChange', mockListeners.posterImageContentsChange);
    testArea.addListener('posterStarChange', mockListeners.posterStarChange);
  });

  describe('updateFrom', () => {
    it('Does not update the id property', () => {
      const existingID = testArea.id;
      const newModel: PosterSessionArea = {
        id: nanoid(),
        title: nanoid(),
        imageContents: nanoid(),
        stars: testAreaModel.stars + 1,
      };
      testArea.updateFrom(newModel);
      expect(testArea.id).toEqual(existingID);
    });
    it('Updates the title property', () => {
      const newTitle = nanoid();
      const newModel: PosterSessionArea = {
        id: testAreaModel.id,
        title: newTitle,
        imageContents: testAreaModel.imageContents,
        stars: testAreaModel.stars,
      };
      testArea.updateFrom(newModel);
      expect(testArea.title).toEqual(newTitle);
      expect(mockListeners.posterTitleChange).toBeCalledTimes(1);
    });
    it('Updates the imageContents property', () => {
      const newImageContents = nanoid();
      const newModel: PosterSessionArea = {
        id: testAreaModel.id,
        title: testAreaModel.title,
        imageContents: newImageContents,
        stars: testAreaModel.stars,
      };
      testArea.updateFrom(newModel);
      expect(testArea.imageContents).toEqual(newImageContents);
      expect(mockListeners.posterImageContentsChange).toBeCalledTimes(1);
    });

    it('Updates the stars property', () => {
      const newStars = testAreaModel.stars + 1;
      const newModel: PosterSessionArea = {
        id: testAreaModel.id,
        title: testAreaModel.title,
        imageContents: testAreaModel.imageContents,
        stars: newStars,
      };
      testArea.updateFrom(newModel);
      expect(testArea.stars).toEqual(newStars);
      expect(mockListeners.posterStarChange).toBeCalledTimes(1);
    });
  });
});
