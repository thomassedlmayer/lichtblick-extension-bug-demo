import { ExtensionContext } from "@foxglove/extension";
import { SceneUpdate } from "@foxglove/schemas";
import { SensorView, GroundTruth } from "@lichtblick/asam-osi-types";
import { DeepPartial } from "ts-essentials";

export function activate(extensionContext: ExtensionContext): void {
  let i = 0;
  /* let previousBody: string | undefined;
  const body = undefined; */

  const testExtension = (osiGroundTruth: GroundTruth): DeepPartial<SceneUpdate> => {
    const sec = osiGroundTruth.timestamp?.seconds ?? 0;
    const nanos = osiGroundTruth.timestamp?.nanos ?? 0;

    /* body = i.toString(); */

    console.log("testExtension called for GroundTruth timestamp:", sec, nanos);

    i++;

    /* if (body !== previousBody) {
      fetch("http://127.0.0.1:5000", {
        method: "POST",
        headers: {
          "Content-Type": "application/octet-stream",
        },
        body: sec.toString() + " " + nanos.toString() + " " + body,
      })
        .then(async (response) => {
          if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
          }
          return await response.text();
        })
        .then((data) => {
          console.log("Successfully sent encodedSceneEntity:", data);
        })
        .catch((error: unknown) => {
          console.error("Failed to send encodedSceneEntity:", error);
        });

      previousBody = body;
    } */

    return {
      deletions: [],
      entities: [],
    };
  };

  extensionContext.registerMessageConverter({
    fromSchemaName: "osi3.GroundTruth",
    toSchemaName: "foxglove.SceneUpdate",
    converter: testExtension,
  });

  extensionContext.registerMessageConverter({
    fromSchemaName: "osi3.SensorView",
    toSchemaName: "foxglove.SceneUpdate",
    converter: (osiSensorView: SensorView) => {
      if (osiSensorView.global_ground_truth == undefined) {
        return {
          deletions: [],
          entities: [],
        };
      }
      return testExtension(osiSensorView.global_ground_truth);
    },
  });

  extensionContext.registerMessageConverter({
    fromSchemaName: "osi3.GroundTruth",
    toSchemaName: "foxglove.FrameTransform",
    converter: (_: SensorView) => {
      return {
        timestamp: {
          sec: i,
          nsec: 0,
        },
        parent_frame_id: "<root>",
        child_frame_id: "test_frame_transform",
        translation: {
          x: 0,
          y: 0,
          z: 0,
        },
        rotation: {
          x: 0,
          y: 0,
          z: 0,
          w: 0,
        },
      };
    },
  });

  extensionContext.registerMessageConverter({
    fromSchemaName: "osi3.SensorView",
    toSchemaName: "foxglove.FrameTransform",
    converter: (_: SensorView) => {
      return {
        timestamp: {
          sec: i,
          nsec: 0,
        },
        parent_frame_id: "<root>",
        child_frame_id: "test_frame_transform",
        translation: {
          x: 0,
          y: 0,
          z: 0,
        },
        rotation: {
          x: 0,
          y: 0,
          z: 0,
          w: 0,
        },
      };
    },
  });
}
