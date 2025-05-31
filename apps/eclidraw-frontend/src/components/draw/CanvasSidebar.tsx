"use client";
import { ColorPicker } from "antd";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setBgColor,
  setStroke,
  setStrokeStyle,
  setStrokeWidth,
} from "@/store/features/canvas/canvasSlice";
import { StrokeStyleType } from "@/interfaces";

const CanvasSidebar = () => {
  const { stroke, bgColor, strokeWidth, strokeStyle } = useAppSelector(
    (state) => state.canvas,
  );
  const dispatch = useAppDispatch();

  const handleStrokeColorChange = (color: string) => {
    dispatch(setStroke(color));
  };

  const handleBgColorChange = (color: string) => {
    dispatch(setBgColor(color));
  };

  const handleStrokeWidth = (_strokeWidth: number) => {
    dispatch(setStrokeWidth(_strokeWidth));
  };

  const handleStrokeStyle = (_stokeStyle: StrokeStyleType) => {
    dispatch(setStrokeStyle(_stokeStyle));
  };

  return (
    <div className="fixed top-[50%] left-[10%] -translate-x-[50%] -translate-y-[50%]">
      <div className="bg-gray-600 rounded p-4 text-white space-y-4">
        {/* Stroke */}
        <div>
          <h2 className="mb-2">Stroke</h2>
          <ColorInput
            handleColorChange={handleStrokeColorChange}
            activeColor={stroke}
          />
        </div>

        {/* Background Color    */}
        <div>
          <h2 className="mb-2">Background</h2>
          <ColorInput
            handleColorChange={handleBgColorChange}
            activeColor={bgColor}
          />
        </div>

        {/*Stroke Width*/}
        <div>
          <h2 className="mb-2">Stroke Width</h2>

          <div className="flex items-center gap-x-4">
            <div
              className={`w-[60px] h-[30px] rounded cursor-pointer flex items-center justify-center 
                ${strokeWidth === 1 ? "bg-indigo-400" : "bg-gray-400"}
              `}
              onClick={() => {
                handleStrokeWidth(1);
              }}
            >
              <div className="border-t-[2px] border-white w-[50%]" />
            </div>

            <div
              className={`w-[60px] h-[30px] rounded cursor-pointer flex items-center justify-center 
                ${strokeWidth === 4 ? "bg-indigo-400" : "bg-gray-400"}
              `}
              onClick={() => {
                handleStrokeWidth(4);
              }}
            >
              <div className="border-t-[4px] border-white w-[50%]" />
            </div>

            <div
              className={`w-[60px] h-[30px] rounded cursor-pointer flex items-center justify-center 
                ${strokeWidth === 6 ? "bg-indigo-400" : "bg-gray-400"}
              `}
              onClick={() => {
                handleStrokeWidth(6);
              }}
            >
              <div className="border-t-[7px] border-white w-[50%]" />
            </div>
          </div>
        </div>

        {/*Stroke Style*/}
        <div>
          <h2 className="mb-2">Stroke Style</h2>

          <div className="flex items-center gap-x-4">
            <div
              className={`w-[60px] h-[30px] rounded cursor-pointer flex items-center justify-center 
                ${strokeStyle === "solid" ? "bg-indigo-400" : "bg-gray-400"}
              `}
              onClick={() => {
                handleStrokeStyle("solid");
              }}
            >
              <div className="border-t-[4px] border-white w-[50%]" />
            </div>

            <div
              className={`w-[60px] h-[30px] rounded cursor-pointer flex items-center justify-center 
                ${strokeStyle === "dotted" ? "bg-indigo-400" : "bg-gray-400"}
              `}
              onClick={() => {
                handleStrokeStyle("dotted");
              }}
            >
              <div className="border-t-[4px] border-white w-[50%] border-dotted" />
            </div>

            <div
              className={`w-[60px] h-[30px] rounded cursor-pointer flex items-center justify-center 
                ${strokeStyle === "dashed" ? "bg-indigo-400" : "bg-gray-400"}
              `}
              onClick={() => {
                handleStrokeStyle("dashed");
              }}
            >
              <div className="border-t-[4px] border-white w-[50%] border-dashed" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

type ColorInputPropsType = {
  handleColorChange: (color: string) => void;
  activeColor: string;
};

export const ColorInput = ({
  handleColorChange,
  activeColor,
}: ColorInputPropsType) => {
  return (
    <div className="flex gap-x-2">
      <div
        className={`bg-[#ffffff] w-[25px] h-[25px] rounded cursor-pointer 
        ${activeColor.toLowerCase() === "#ffffff" ? "border-2 border-black outline outline-white" : ""}`}
        onClick={() => {
          handleColorChange("#ffffff");
        }}
      />

      <div
        className={`bg-[#FF7976] w-[25px] h-[25px] rounded cursor-pointer 
        ${activeColor.toLowerCase() === "#ff7976" ? "border-2 border-black outline outline-white" : ""}`}
        onClick={() => {
          handleColorChange("#FF7976");
        }}
      />

      <div
        className={`bg-[#308E40] w-[25px] h-[25px] rounded cursor-pointer 
        ${activeColor.toLowerCase() === "#308e40" ? "border-2 border-black outline outline-white" : ""}`}
        onClick={() => {
          handleColorChange("#308E40");
        }}
      />

      <div
        className={`bg-[#589AE0] w-[25px] h-[25px] rounded cursor-pointer 
        ${activeColor.toLowerCase() === "#589ae0" ? "border-2 border-black outline outline-white" : ""}`}
        onClick={() => {
          handleColorChange("#589AE0");
        }}
      />

      <div
        className={`bg-[#AF5900] w-[25px] h-[25px] rounded cursor-pointer 
        ${activeColor.toLowerCase() === "#af5900" ? "border-2 border-black outline outline-white" : ""}`}
        onClick={() => {
          handleColorChange("#AF5900");
        }}
      />

      <div className="border-l border-gray-300" />

      <ColorPicker
        defaultValue="#ffffff"
        onChange={(value) => {
          handleColorChange(value.toHexString());
        }}
        size="small"
      />
    </div>
  );
};

export default CanvasSidebar;
