
import { useMainStore } from "../store/useMainStore";
import { storeToRefs } from "pinia";


function poseSquat() {
    const main = useMainStore();
    const { currentModelState } = storeToRefs(main);
    const { toggleModelState } = main;
    toggleModelState(true);

    var video = document.getElementById("video");
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    // The detected positions will be inside an array
    let poses = [];
    // Create a webcam capture
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
            video.srcObject = stream;
            video.play();
        });
    }

    function drawCameraIntoCanvas() {
        ctx.setTransform(-1, 0, 0, 1, 640, 0);
        ctx.drawImage(video, 0, 0, 640, 480);
        window.requestAnimationFrame(drawCameraIntoCanvas);
    }
    // Loop over the drawCameraIntoCanvas function
    drawCameraIntoCanvas();

    // Create a new poseNet method with a single detection
    const poseNet = ml5.poseNet(video, modelReady);
    poseNet.on("pose", gotPoses);

    // A function that gets called every time there's an update from the model

    function gotPoses(results) {
        poses = results;
        if (currentModelState.value) {
            checkPose();
        }
    }

    function modelReady() {
        console.log("model ready");
        poseNet.multiPose(video);
    }

    function checkPose() {
        if (poses[0]) {
            let pose = poses[0].pose;
            let rWrist = pose.rightWrist;
            let lWrist = pose.leftWrist;
            let rElbow = pose.rightElbow;
            let lElbow = pose.leftElbow;
            let rShoulder = pose.rightShoulder;
            let lShoulder = pose.leftShoulder;
            let rHip = pose.rightHip;
            let lHip = pose.leftHip;
            let rKnee = pose.rightKnee;
            let lKnee = pose.leftKnee;
            let rAnkle = pose.rightAnkle;
            let lAnkle = pose.leftAnkle;


            let lElbowAngle = Math.abs((Math.atan2(lWrist.y - lElbow.y, lWrist.x - lElbow.x) - Math.atan2(lShoulder.y - lElbow.y, lShoulder.x - lElbow.x)) * 180 / Math.PI)
            let rElbowAngle = Math.abs((Math.atan2(rWrist.y - rElbow.y, rWrist.x - rElbow.x) - Math.atan2(rShoulder.y - rElbow.y, rShoulder.x - rElbow.x)) * 180 / Math.PI)

            let lKneeAngle = Math.abs((Math.atan2(lHip.y - lKnee.y, lHip.x - lKnee.x) - Math.atan2(lAnkle.y - lKnee.y, lAnkle.x - lKnee.x)) * 180 / Math.PI)
            let rKneeAngle = Math.abs((Math.atan2(rHip.y - rKnee.y, rHip.x - rKnee.x) - Math.atan2(rAnkle.y - rKnee.y, rAnkle.x - rKnee.x)) * 180 / Math.PI)

            let position = "top"
            let counter = 0
            if (position == "top") {
                if (lElbowAngle < 90) {
                    counter++;
                    console.log("1 Dumbell Curl Done!")
                    position = "bottom"
                    //console.log(position)
                }
            }
            if (position == "bottom") {
                if (lElbowAngle >= 70) {
                    position = "top"

                }
            }
        }
    }

}


const useSquat = () => {
    return {
        poseSquat,
    }
}

export default useSquat