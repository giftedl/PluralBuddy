import { ComponentCommand, type ComponentContext } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { writeBack } from "@/lib/pk-sync-engine";
import { alterCollection, tagCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import { AlertAssignTagView, assignTagPagination } from "@/views/alter-assign-tag";
import { w } from "@/webhooks";

export default class ToggleAssignButton extends ComponentCommand {
  componentType = "Button" as const;

  override filter(context: ComponentContext<typeof this.componentType>) {
    return InteractionIdentifier.Systems.Configuration.AlterAssignPagination.ToggleAssign.startsWith(
      context.customId,
    );
  }

  override async run(ctx: ComponentContext<typeof this.componentType>) {
    const paginationToken =
      InteractionIdentifier.Systems.Configuration.AlterAssignPagination.ToggleAssign.substring(
        ctx.customId,
      )[0];
    const tagId =
      InteractionIdentifier.Systems.Configuration.AlterAssignPagination.ToggleAssign.substring(
        ctx.customId,
      )[1] ?? "";

    const corresponding = assignTagPagination.find((v) => v.id === paginationToken);
    const user = await ctx.retrievePUser();

    if (user.system === undefined) {
      return await ctx.ephemeral({
        components: new AlertView(await ctx.userTranslations()).errorView(
          "ERROR_SYSTEM_DOESNT_EXIST",
        ),
        flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
      });
    }

    if (corresponding === undefined) {
      return await ctx.write({
        components: [
          ...new AlertView(await ctx.userTranslations()).errorView(
            "ERROR_ASSIGN_PAGINATION_TOO_OLD",
          ),
        ],
        flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
      });
    }

    if (corresponding.alter.tagIds.includes(tagId)) {
      // Already has tag, remove tag

      await alterCollection.updateOne(
        {
          alterId: corresponding.alter.alterId,
          systemId: corresponding.alter.systemId,
        },
        {
          $pull: { tagIds: tagId },
        },
      );
      await tagCollection.updateOne(
        { tagId, systemId: corresponding.alter.systemId },
        { $pull: { associatedAlters: corresponding.alter.alterId.toString() } },
      );

      w(ctx.author.id, "alter.update", {
        type: "alter.update",
        alter: {
          ...corresponding.alter,
          tagIds: corresponding.alter.tagIds.filter((v) => v !== tagId),
        },
      });

      (async () => {
        const tag = await tagCollection.findOne({ tagId });

        w(ctx.author.id, "tag.update", {
          type: "tag.update",
          tag,
        });

        if (tag?.fields["@/converter/pk"] && corresponding.alter.fields["@/converter/pk"])
          writeBack({
            type: "member-group-relationship",
            id: corresponding.alter.fields["@/converter/pk"],
            change: {
              type: "remove",
              groupId: tag?.fields["@/converter/pk"],
            },
            syncConfig: (await ctx.retrievePUser()).syncConfiguration,
          });
      })();

      // Refresh from database
      const nextAlter = await alterCollection.findOne({
        alterId: corresponding.alter.alterId,
        systemId: corresponding.alter.systemId,
      });

      assignTagPagination.splice(
        assignTagPagination.findIndex((v) => v.id === corresponding.id),
        1,
      );

      corresponding.alter = nextAlter!;

      assignTagPagination.push(corresponding);
    } else {
      // Assign tag

      await alterCollection.updateOne(
        {
          alterId: corresponding.alter.alterId,
          systemId: corresponding.alter.systemId,
        },
        {
          $push: { tagIds: tagId },
        },
      );
      await tagCollection.updateOne(
        { tagId, systemId: corresponding.alter.systemId },
        { $push: { associatedAlters: corresponding.alter.alterId.toString() } },
      );

      w(ctx.author.id, "alter.update", {
        type: "alter.update",
        alter: {
          ...corresponding.alter,
          tagIds: [...corresponding.alter.tagIds, corresponding.alter.alterId.toString()],
        },
      });

      (async () => {
        const tag = await tagCollection.findOne({ tagId });

        w(ctx.author.id, "tag.update", {
          type: "tag.update",
          tag,
        });

        if (tag?.fields["@/converter/pk"] && corresponding.alter.fields["@/converter/pk"])
          writeBack({
            type: "member-group-relationship",
            id: corresponding.alter.fields["@/converter/pk"],
            change: {
              type: "add",
              groupId: tag?.fields["@/converter/pk"],
            },
            syncConfig: (await ctx.retrievePUser()).syncConfiguration,
          });
      })();

      // Refresh from database
      const nextAlter = await alterCollection.findOne({
        alterId: corresponding.alter.alterId,
        systemId: corresponding.alter.systemId,
      });

      assignTagPagination.splice(
        assignTagPagination.findIndex((v) => v.id === corresponding.id),
        1,
      );

      corresponding.alter = nextAlter!;

      assignTagPagination.push(corresponding);
    }

    return await ctx.update({
      components: [
        ...(await new AlertAssignTagView(await ctx.userTranslations()).alterAssignTag(
          user.system,
          undefined,
          corresponding,
        )),
      ],
    });
  }
}
