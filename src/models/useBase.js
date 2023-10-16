
import { useMainStore } from "../store/useMainStore";
import { storeToRefs } from "pinia";


function baseFunction() {
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

            let lElbowAngle = Math.abs((Math.atan2(lWrist.y - lElbow.y, lWrist.x - lElbow.x) - Math.atan2(lShoulder.y - lElbow.y, lShoulder.x - lElbow.x)) * 180 / Math.PI)
            let rElbowAngle = Math.abs((Math.atan2(rWrist.y - rElbow.y, rWrist.x - rElbow.x) - Math.atan2(rShoulder.y - rElbow.y, rShoulder.x - rElbow.x)) * 180 / Math.PI)

            let lShoulderAngle = Math.abs((Math.atan2(lElbow.y - lShoulder.y, lElbow.x - lShoulder.x) - Math.atan2(lHip.y - lShoulder.y, lHip.x - lShoulder.x)) * 180 / Math.PI)
            let rShoulderAngle = Math.abs((Math.atan2(rElbow.y - rShoulder.y, rElbow.x - rShoulder.x) - Math.atan2(rHip.y - rShoulder.y, rHip.x - rShoulder.x)) * 180 / Math.PI)


            if (lElbowAngle > 160 && lElbowAngle < 200 && rElbowAngle > 160 && rElbowAngle < 200 && lShoulderAngle > 70 && lShoulderAngle < 120 && rShoulderAngle > 70 && rShoulderAngle < 120) {
                console.log("Assan detected! Starting timer!")
            }
            else {
                console.log("Nothing detected!")
            }
        }
    }

}


const useBase = () => {
    return {
        baseFunction,
    }
}

export default useBase