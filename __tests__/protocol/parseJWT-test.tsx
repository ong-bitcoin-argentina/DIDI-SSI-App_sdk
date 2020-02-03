import { isLeft, isRight } from "fp-ts/lib/Either";

import { unverifiedParseJWT } from "../../src/parse/parseJWT";

describe(unverifiedParseJWT, () => {
	it("should error when parsing url", () => {
		const result = unverifiedParseJWT("www.example.com");
		expect(isLeft(result)).toBeTruthy();
	});
	it("should succeed when parsing jwt", () => {
		const result = unverifiedParseJWT(
			"eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NkstUiJ9.eyJpYXQiOjE1ODA3NTgyNDAsInN1YiI6ImRpZDpldGhyOjB4ZDI2ODJkODU4N2Q0YzY2ZDE0MjQ2MGU5MGEzOTI4ZGRlODVmODM2MyIsInZjIjp7IkBjb250ZXh0IjpbImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIl0sInR5cGUiOlsiVmVyaWZpYWJsZUNyZWRlbnRpYWwiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiRW1haWwiOnsicHJldmlldyI6eyJ0eXBlIjowLCJmaWVsZHMiOlsiZW1haWwiXX0sImNhdGVnb3J5IjoiaWRlbnRpdHkiLCJkYXRhIjp7ImVtYWlsIjoiYUBhLmNvbSJ9fX19LCJpc3MiOiJkaWQ6ZXRocjoweERGQTUxOGNlYUVkMWJmZTZmNzA0RTUxQTE4ZDRiQjBBMTQ3MTRjZDIifQ.Q5nYP0coi5fWdjNuvi79AGZCx7bWADfvHIxpFVIMowwi-qXnLOA0EYFYahpUKyefEAfX9QeoQjiYAskfBoeNJAA"
		);
		expect(isRight(result)).toBeTruthy();
	});
});
