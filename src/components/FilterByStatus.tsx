import ToggleButton, { toggleButtonClasses } from "@mui/material/ToggleButton";
import ToggleButtonGroup, {
  toggleButtonGroupClasses,
} from "@mui/material/ToggleButtonGroup";
import { styled } from "@mui/material/styles";

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  gap: "1rem",
  [`& .${toggleButtonGroupClasses.firstButton}, & .${toggleButtonGroupClasses.middleButton}`]:
    {
      borderTopRightRadius: (theme.vars || theme).shape.borderRadius,
      borderBottomRightRadius: (theme.vars || theme).shape.borderRadius,
    },
  [`& .${toggleButtonGroupClasses.lastButton}, & .${toggleButtonGroupClasses.middleButton}`]:
    {
      borderTopLeftRadius: (theme.vars || theme).shape.borderRadius,
      borderBottomLeftRadius: (theme.vars || theme).shape.borderRadius,
      borderLeft: `1px solid ${(theme.vars || theme).palette.divider}`,
    },
  [`& .${toggleButtonGroupClasses.lastButton}.${toggleButtonClasses.disabled}, & .${toggleButtonGroupClasses.middleButton}.${toggleButtonClasses.disabled}`]:
    {
      borderLeft: `1px solid ${
        (theme.vars || theme).palette.action.disabledBackground
      }`,
    },
}));

const buttonStyles = {
  backgroundColor: "var(--text-color-primary)",
  color: "black",

  "&.Mui-selected": {
    backgroundColor: "var(--accent-color)",
    color: "black",
  },

  "&:hover": {
    backgroundColor: "grey",
    color: "white",
  },
  "&.Mui-selected:hover": {
    backgroundColor: "grey",
    color: "white",
  },
};

export default function FilterByStatus({
  statusQuery,
  setStatusQuery,
}: {
  statusQuery: string | null;
  setStatusQuery: Function;
}) {
  function handleChange(_: React.MouseEvent<HTMLElement>, value: string) {
    setStatusQuery("status", value);
  }

  return (
    <StyledToggleButtonGroup
      color="primary"
      value={statusQuery ? statusQuery : ""}
      exclusive
      onChange={handleChange}
      aria-label="Platform"
      sx={{
        alignItems: "center",
      }}
    >
      <ToggleButton
        value=""
        sx={buttonStyles}
        classes={!statusQuery && "Mui-selected"}
        size="small"
      >
        All
      </ToggleButton>
      <ToggleButton value="active" sx={buttonStyles} size="small">
        Active
      </ToggleButton>
      <ToggleButton value="rejected" sx={buttonStyles} size="small">
        Rejected
      </ToggleButton>
      <ToggleButton value="archived" sx={buttonStyles} size="small">
        Archived
      </ToggleButton>
    </StyledToggleButtonGroup>
  );
}
